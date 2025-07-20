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
    images: List[UploadFile] = File(...)
):
    if not images or not userGifRequestId or not userId:
        raise HTTPException(status_code=400, detail="Missing required parameters.")
    if len(images) != 12 and len(images) != 24:
        raise HTTPException(status_code=400, detail="Exactly 12 or 24 images required.")

    # Load the overlay frame (should be 1080p, RGBA, transparent)
    try:
        overlay_frame = Image.open(FRAME_OVERLAY_PATH).convert("RGBA")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load overlay frame: {e}")

    async def process_single_image(idx, upload_file):
        try:
            img_bytes = await upload_file.read()
            img = Image.open(io.BytesIO(img_bytes)).convert("RGBA")
            # Remove background
            out_img = await asyncio.to_thread(remove, img, session=session)
            # Resize out_img to match overlay_frame size if needed
            if out_img.size != overlay_frame.size:
                out_img = out_img.resize(overlay_frame.size, Image.LANCZOS)
            # Overlay the frame
            composited = Image.alpha_composite(out_img, overlay_frame)
            # Resize to 1080p if needed
            if composited.width != 1080:
                h = int(composited.height * (1080 / composited.width))
                composited = composited.resize((1080, h), Image.LANCZOS)
            # Remove transparency: paste on solid background
            background = Image.new("RGB", composited.size, (43, 144, 208))
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
    with tempfile.TemporaryDirectory() as tmpdir:
        frame_paths = []
        for idx, img in enumerate(processed_images):
            frame_path = os.path.join(tmpdir, f"frame_{idx:03d}.webp")
            img.save(frame_path, format="WEBP")
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

