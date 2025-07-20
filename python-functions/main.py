import io
import os
os.environ["U2NET_HOME"] = os.path.join(os.path.dirname(__file__), "lib")
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from rembg import remove, new_session
from PIL import Image
import requests
from supabase import create_client, Client

app = FastAPI()

# Downloading data from 'https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx' to file '/Users/keyrrjohnmelperino/.u2net/u2net.onnx'.

# Set these as environment variables or hardcode for testing
SUPABASE_URL = "https://lbrxffrgccdojnugwkgn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxicnhmZnJnY2Nkb2pudWd3a2duIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU0ODE0OCwiZXhwIjoyMDY4MTI0MTQ4fQ.eLxwP-fJbkW_m7gzJ3t73Z6U0epdnjPLumqt9ZuN9rg"
SUPABASE_BUCKET = os.environ.get("SUPABASE_BUCKET", "gifs")

session = new_session("u2net")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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