import io
import os
os.environ["U2NET_HOME"] = os.path.join(os.path.dirname(__file__), "lib")
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from rembg import remove, new_session
from PIL import Image
import requests
from supabase import create_client, Client
from typing import List
import asyncio
from fastapi import UploadFile, File, Form
from tempfile import TemporaryDirectory
from PIL import ImageSequence
import subprocess
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Downloading data from 'https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx' to file '/Users/keyrrjohnmelperino/.u2net/u2net.onnx'.

# Set these as environment variables or hardcode for testing
SUPABASE_URL = "https://lbrxffrgccdojnugwkgn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxicnhmZnJnY2Nkb2pudWd3a2duIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU0ODE0OCwiZXhwIjoyMDY4MTI0MTQ4fQ.eLxwP-fJbkW_m7gzJ3t73Z6U0epdnjPLumqt9ZuN9rg"
SUPABASE_BUCKET = os.environ.get("SUPABASE_BUCKET", "gifs")

session = new_session("u2net")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Path to your transparent PNG frame (should be 1080p, RGBA)
FRAME_OVERLAY_PATH = os.environ.get("FRAME_OVERLAY_PATH", os.path.join(os.path.dirname(__file__), "lib", "frame_overlay.png"))

FRAME_MAP = {
    "care": {
        # "color": (43, 144, 208),
        "color": (255, 255, 255),
        "frames": [
            os.environ.get("FRAME_OVERLAY_PATH", os.path.join(os.path.dirname(__file__), "lib", "frames", f"blue-{shape}.png"))
            for shape in ["star", "sun", "diamond", "circle", "hexagon"]
        ]
    },
    "future": {
        # "color": (114, 143, 61),
        "color": (255, 255, 255),
        "frames": [
            os.environ.get("FRAME_OVERLAY_PATH", os.path.join(os.path.dirname(__file__), "lib", "frames", f"green-{shape}.png"))
            for shape in ["star", "sun", "diamond", "circle", "hexagon"]
        ]
    },
    "support": {
        # "color": (247, 235, 223),
        "color": (255, 255, 255),
        "frames": [
            os.environ.get("FRAME_OVERLAY_PATH", os.path.join(os.path.dirname(__file__), "lib", "frames", f"dry-orange-{shape}.png"))
            for shape in ["star", "sun", "diamond", "circle", "hexagon"]
        ]
    },
}


# Clean frame overlay mapping per pledge
CLEAN_FRAME_MAP = {
    "care": os.path.join(os.path.dirname(__file__), "lib", "frames", "clean-frames", "blue.png"),
    "future": os.path.join(os.path.dirname(__file__), "lib", "frames", "clean-frames", "green.png"),
    "support": os.path.join(os.path.dirname(__file__), "lib", "frames", "clean-frames", "dry.png"),
}

STICKER_TYPES = ["circle", "diamond", "star", "hexagon", "sun"]


@app.post("/process-frames-to-gif-old")
async def process_frames_to_gif(
    userGifRequestId: str = Form(...),
    userId: str = Form(...),
    images: List[UploadFile] = File(...),
    pledge: str = Form(...),
):
    if pledge not in FRAME_MAP:
        raise HTTPException(status_code=400, detail=f"Invalid pledge: {pledge}")
    color = FRAME_MAP[pledge]["color"]
    frame_choices = FRAME_MAP[pledge]["frames"]
    # Pick a random overlay frame for this request
    overlay_frame_path = random.choice(frame_choices)
    try:
        overlay_frame = Image.open(overlay_frame_path).convert("RGBA")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load overlay frame: {e}")

    async def process_single_image(idx, upload_file):
        try:
            img_bytes = await upload_file.read()
            img = Image.open(io.BytesIO(img_bytes)).convert("RGBA")
            # Remove background
            out_img = await asyncio.to_thread(remove, img, session=session)
            # Center the 672x672 image on a 720x720 canvas
            if out_img.width != 672 or out_img.height != 672:
                out_img = out_img.resize((672, 672), Image.LANCZOS)
            base_canvas = Image.new("RGBA", (720, 720), (0, 0, 0, 0))
            offset = ((720 - 672) // 2, (720 - 672) // 2)
            base_canvas.paste(out_img, offset, out_img)
            # Overlay the frame (overlay_frame should be 720x720)
            composited = Image.alpha_composite(base_canvas, overlay_frame)
            # Remove transparency: paste on solid background
            background = Image.new("RGB", composited.size, color)
            background.paste(composited, mask=composited.split()[-1])
            return background
        except Exception as e:
            raise Exception(f"Frame {idx+1} failed: {e}")

    # Process all images in parallel
    try:
        processed_images = await asyncio.gather(*[
            process_single_image(idx, upload_file) for idx, upload_file in enumerate(images)
        ])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing failed: {e}")

    # Save as GIF (12 or 24 frames)
    if len(processed_images) not in (12, 24):
        raise HTTPException(status_code=500, detail=f"Expected 12 or 24 processed images, got {len(processed_images)}")
    base_size = processed_images[0].size
    for idx, img in enumerate(processed_images):
        if not isinstance(img, Image.Image):
            raise HTTPException(status_code=500, detail=f"Frame {idx+1} is not a valid image: {type(img)}")
        if img.size != base_size:
            raise HTTPException(status_code=500, detail=f"Frame {idx+1} size {img.size} does not match first frame size {base_size}")

    import tempfile, os
    frame_buffers = []
    for idx, img in enumerate(processed_images):
        buf = io.BytesIO()
        img.save(buf, format="WEBP")
        buf.seek(0)
        frame_buffers.append(buf)
    with tempfile.TemporaryDirectory() as tmpdir:
        frame_paths = []
        for idx, buf in enumerate(frame_buffers):
            frame_path = os.path.join(tmpdir, f"frame_{idx:03d}.webp")
            with open(frame_path, "wb") as f:
                f.write(buf.read())
            frame_paths.append(frame_path)
        gif_path = os.path.join(tmpdir, "output.gif")
        # Use ImageMagick to create a high-quality GIF
        delay = 17 if len(processed_images) == 12 else 8
        convert_cmd = [
            "magick",
            "-delay", str(delay),
            "-loop", "0",
            *frame_paths,
            "-layers", "OptimizeTransparency",
            gif_path
        ]
        try:
            subprocess.run(convert_cmd, check=True)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"ImageMagick GIF encoding failed: {e}")
        with open(gif_path, "rb") as f:
            gif_bytes = f.read()

    key = f"gifs/{userId}/{userGifRequestId}/final.gif"
    try:
        res = supabase.storage.from_(SUPABASE_BUCKET).upload(
            key,
            gif_bytes,
            file_options={"content-type": "image/gif", "upsert": "true"}
        )
        signed = supabase.storage.from_(SUPABASE_BUCKET).create_signed_url(key, 631152000)
        signed_url = signed.get("signedURL") or signed.get("signed_url") or signed.get("url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase upload failed: {e}")

    return JSONResponse({
        "status": "SUCCESS",
        "gifUrl": signed_url,
        "key": key
    })


@app.post("/process-frames-to-gif")
async def process_frames_to_gif_with_sticker(
    userGifRequestId: str = Form(...),
    userId: str = Form(...),
    images: List[UploadFile] = File(...),
    pledge: str = Form(...),
):
    if pledge not in FRAME_MAP:
        raise HTTPException(status_code=400, detail=f"Invalid pledge: {pledge}")

    color = FRAME_MAP[pledge]["color"]

    # Load clean frame overlay for this pledge
    clean_frame_path = CLEAN_FRAME_MAP.get(pledge)
    if not clean_frame_path or not os.path.exists(clean_frame_path):
        raise HTTPException(status_code=500, detail=f"Missing clean frame for pledge '{pledge}' at '{clean_frame_path}'")
    try:
        clean_frame_overlay = Image.open(clean_frame_path).convert("RGBA")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load clean frame overlay: {e}")

    # Choose a random animated sticker type and load its 24 frames
    chosen_sticker_type = random.choice(STICKER_TYPES)
    sticker_dir = os.path.join(os.path.dirname(__file__), "lib", "frames", "animated-stickers", chosen_sticker_type)
    try:
        sticker_frames: List[Image.Image] = []
        for i in range(1, 25):  # 1..24
            frame_path = os.path.join(sticker_dir, f"{i}.png")
            if not os.path.exists(frame_path):
                raise FileNotFoundError(f"Sticker frame not found: {frame_path}")
            sticker_frames.append(Image.open(frame_path).convert("RGBA"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load sticker frames: {e}")

    async def process_single_image(idx, upload_file):
        try:
            img_bytes = await upload_file.read()
            img = Image.open(io.BytesIO(img_bytes)).convert("RGBA")
            # Remove background
            out_img = await asyncio.to_thread(remove, img, session=session)
            # Center the 672x672 image on a 720x720 canvas
            if out_img.width != 672 or out_img.height != 672:
                out_img = out_img.resize((672, 672), Image.LANCZOS)
            base_canvas = Image.new("RGBA", (720, 720), (0, 0, 0, 0))
            offset = ((720 - 672) // 2, (720 - 672) // 2)
            base_canvas.paste(out_img, offset, out_img)

            # First overlay: clean frame (assumed 720x720)
            composited = Image.alpha_composite(base_canvas, clean_frame_overlay)

            # Second overlay: animated sticker frame centered
            if len(images) == 24:
                sticker_idx = idx % 24
            elif len(images) == 12:
                sticker_idx = (idx * 2) % 24
            else:
                raise Exception(f"Expected 12 or 24 images, got {len(images)}")

            sticker_im = sticker_frames[sticker_idx]
            if sticker_im.mode != "RGBA":
                sticker_im = sticker_im.convert("RGBA")

            # Paste the sticker centered onto composited RGBA canvas
            if sticker_im.size != composited.size:
                # paste_x = (composited.width - sticker_im.width) // 2
                # paste_y = (composited.height - sticker_im.height) // 2
                paste_x = (composited.width - sticker_im.width) - 40
                paste_y = (composited.height - sticker_im.height) - 90
                composited.paste(sticker_im, (paste_x, paste_y), sticker_im)
            else:
                composited = Image.alpha_composite(composited, sticker_im)

            # Remove transparency by pasting onto solid background color
            background = Image.new("RGB", composited.size, color)
            background.paste(composited, mask=composited.split()[-1])
            return background
        except Exception as e:
            raise Exception(f"Frame {idx+1} failed: {e}")

    # Process all images in parallel
    try:
        processed_images = await asyncio.gather(*[
            process_single_image(idx, upload_file) for idx, upload_file in enumerate(images)
        ])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing failed: {e}")

    # Validate frames
    if len(processed_images) not in (12, 24):
        raise HTTPException(status_code=500, detail=f"Expected 12 or 24 processed images, got {len(processed_images)}")
    base_size = processed_images[0].size
    for idx, img in enumerate(processed_images):
        if not isinstance(img, Image.Image):
            raise HTTPException(status_code=500, detail=f"Frame {idx+1} is not a valid image: {type(img)}")
        if img.size != base_size:
            raise HTTPException(status_code=500, detail=f"Frame {idx+1} size {img.size} does not match first frame size {base_size}")

    # Encode GIF via ImageMagick for quality
    import tempfile
    frame_buffers = []
    for idx, img in enumerate(processed_images):
        buf = io.BytesIO()
        img.save(buf, format="WEBP")
        buf.seek(0)
        frame_buffers.append(buf)
    with tempfile.TemporaryDirectory() as tmpdir:
        frame_paths = []
        for idx, buf in enumerate(frame_buffers):
            frame_path = os.path.join(tmpdir, f"frame_{idx:03d}.webp")
            with open(frame_path, "wb") as f:
                f.write(buf.read())
            frame_paths.append(frame_path)
        gif_path = os.path.join(tmpdir, "output.gif")
        delay = 17 if len(processed_images) == 12 else 8
        convert_cmd = [
            "magick",
            "-delay", str(delay),
            "-loop", "0",
            *frame_paths,
            "-layers", "OptimizeTransparency",
            gif_path
        ]
        

        try:
            subprocess.run(convert_cmd, check=True)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"ImageMagick GIF encoding failed: {e}")
        with open(gif_path, "rb") as f:
            gif_bytes = f.read()

    key = f"gifs/{userId}/{userGifRequestId}/final_with_sticker.gif"
    try:
        res = supabase.storage.from_(SUPABASE_BUCKET).upload(
            key,
            gif_bytes,
            file_options={"content-type": "image/gif", "upsert": "true"}
        )
        signed = supabase.storage.from_(SUPABASE_BUCKET).create_signed_url(key, 631152000)
        signed_url = signed.get("signedURL") or signed.get("signed_url") or signed.get("url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase upload failed: {e}")

    return JSONResponse({
        "status": "SUCCESS",
        "gifUrl": signed_url,
        "key": key,
        "stickerType": chosen_sticker_type,
    })
