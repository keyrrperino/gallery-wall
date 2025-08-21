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

ANIMATED_FRAME_MAP = {
    "care": {
        "color": (255, 255, 255),
        "frames": [
            os.path.join(os.path.dirname(__file__), "lib", "frames", f"animated-blue-{shape}.gif")
            for shape in ["star", "sun", "diamond", "circle", "hexagon"]
        ]
    },
    "future": {
        "color": (255, 255, 255),
        "frames": [
            os.path.join(os.path.dirname(__file__), "lib", "frames", f"animated-green-{shape}.gif")
            for shape in ["star", "sun", "diamond", "circle", "hexagon"]
        ]
    },
    "support": {
        "color": (255, 255, 255),
        "frames": [
            os.path.join(os.path.dirname(__file__), "lib", "frames", f"animated-dry-orange-{shape}.gif")
            for shape in ["star", "sun", "diamond", "circle", "hexagon"]
        ]
    },
}

@app.post("/remove-image-background")
async def remove_image_background(request: Request):
    image_url = request.query_params.get("imageUrl")
    user_gif_request_id = request.query_params.get("userGifRequestId")
    user_id = request.query_params.get("userId")
    frame_number = request.query_params.get("frameNumber")

    if not all([image_url, user_gif_request_id, user_id, frame_number]):
        raise HTTPException(status_code=400, detail="Missing required parameters.")

    # Download the image
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        input_image = Image.open(io.BytesIO(response.content)).convert("RGBA")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to download image: {e}")

    # Remove background
    try:
        output_image = remove(input_image, session=session)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Background removal failed: {e}")

    # Composite over white background
    try:
        white_bg = Image.new("RGBA", output_image.size, (255, 255, 255, 255))
        composited = Image.alpha_composite(white_bg, output_image).convert("RGB")
        buf = io.BytesIO()
        composited.save(buf, format="PNG")
        buf.seek(0)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compositing failed: {e}")

    # Upload to Supabase Storage
    key = f"frames/{user_id}/{user_gif_request_id}/{frame_number}-composited.png"
    try:
        res = supabase.storage.from_(SUPABASE_BUCKET).upload(
            key,
            buf.getvalue(),
            file_options={"content-type": "image/png", "upsert": "true"}  # <-- "true" as a string
        )
        # Get signed URL
        signed = supabase.storage.from_(SUPABASE_BUCKET).create_signed_url(key, 631152000)
        signed_url = signed.get("signedURL") or signed.get("signed_url") or signed.get("url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase upload failed: {e}")

    return JSONResponse({
        "status": "SUCCESS",
        "imageUrlComposited": signed_url,
        "key": key
    })


@app.post("/process-frames-to-gif")
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
            "convert",
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

@app.post("/process-frames-to-gif-animated-overlay")
async def process_frames_to_gif_with_animated_frame_overlay(
    userGifRequestId: str = Form(...),
    userId: str = Form(...),
    images: List[UploadFile] = File(...),
    pledge: str = Form(...),
):
    if pledge not in ANIMATED_FRAME_MAP:
        raise HTTPException(status_code=400, detail=f"Invalid pledge: {pledge}")

    color = ANIMATED_FRAME_MAP[pledge]["color"]
    frame_choices = ANIMATED_FRAME_MAP[pledge]["frames"]
    overlay_gif_path = random.choice(frame_choices)

    # Load animated overlay frames (RGBA, 720x720)
    try:
        overlay_gif = Image.open(overlay_gif_path)
        overlay_frames: List[Image.Image] = []
        for frame in ImageSequence.Iterator(overlay_gif):
            rgba = frame.convert("RGBA")
            if rgba.size != (720, 720):
                rgba = rgba.resize((720, 720), Image.LANCZOS)
            overlay_frames.append(rgba)
        if not overlay_frames:
            raise Exception("No frames found in overlay GIF")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load overlay GIF: {e}")

    expected_frames = len(images)
    if expected_frames not in (12, 24):
        raise HTTPException(status_code=400, detail=f"Expected 12 or 24 images, got {expected_frames}")

    # Select overlay frames to match the number of input frames
    step = max(1, len(overlay_frames) // expected_frames)
    selected_overlay_frames = [overlay_frames[(i * step) % len(overlay_frames)] for i in range(expected_frames)]

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
            # Overlay the animated frame for this index
            overlay_frame = selected_overlay_frames[idx]
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

    # Validate frames
    if len(processed_images) not in (12, 24):
        raise HTTPException(status_code=500, detail=f"Expected 12 or 24 processed images, got {len(processed_images)}")
    base_size = processed_images[0].size
    for idx, img in enumerate(processed_images):
        if not isinstance(img, Image.Image):
            raise HTTPException(status_code=500, detail=f"Frame {idx+1} is not a valid image: {type(img)}")
        if img.size != base_size:
            raise HTTPException(status_code=500, detail=f"Frame {idx+1} size {img.size} does not match first frame size {base_size}")

    # Encode to GIF via ImageMagick for quality and size
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
        # Keep timing consistent with existing outputs (~2s total)
        delay = 17 if len(processed_images) == 12 else 8
        convert_cmd = [
            "convert",
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

    key = f"gifs/{userId}/{userGifRequestId}/final-animated.gif"
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

@app.post("/process-frames-to-gif-no-remove-background")
async def process_frames_to_gif_no_background_remove(
    userGifRequestId: str = Form(...),
    userId: str = Form(...),
    images: List[UploadFile] = File(...),
    pledge: str = Form(...),
):
    if pledge not in FRAME_MAP:
        raise HTTPException(status_code=400, detail=f"Invalid pledge: {pledge}")
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
            # Center the 672x672 image on a 720x720 canvas
            if img.width != 672 or img.height != 672:
                img = img.resize((672, 672), Image.LANCZOS)
            base_canvas = Image.new("RGBA", (720, 720), (0, 0, 0, 0))
            offset = ((720 - 672) // 2, (720 - 672) // 2)
            base_canvas.paste(img, offset, img)
            # Overlay the frame (overlay_frame should be 720x720)
            composited = Image.alpha_composite(base_canvas, overlay_frame)
            # Do NOT add a background color, keep as RGBA
            return composited
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
            "convert",
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

