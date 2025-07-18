import { randomUUID } from "crypto";
import { FACE_GEN_BUCKET_NAME, uploadImageUrlToGCP } from "utils";
import { RequestStatusSchema, db } from "../../../../../../packages/database";
import { getSignedUploadUrl, getSignedUrl } from "../../../../../../packages/storage";
import type { RequestBody } from "./types";

export async function GET() {
  return new Response("hello", {
    status: 200
  })
}

export async function POST() {
  return new Response("success 2", {

    status: 200,
  });
}
