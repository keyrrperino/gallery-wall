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

export async function POST(req: Request) {
  const baseUrl = `${req?.url.split("://")[0]}://${req?.headers.get("host")}`;
  const queryString = req?.url ? new URL(req?.url, baseUrl).searchParams : null;
  const requestId = queryString?.get("requestId");
  const setNo = queryString?.get("setNo");

  console.log("queryString: ", queryString?.keys(), queryString?.values())

  try {
    const data = await req.json() as RequestBody;

    console.log("webhookcallbacklog: ", { data }, requestId)

    const { prompt } = data;

    const request = await db.userFaceGenRequests.findUnique({
      where: {
        id: requestId ?? ""
      }
    });

    if (request?.id) {
      const gcpStoragePath = `aigenerated/aigenerate-${randomUUID()}.png`

      let signedUrl;
      try {
        const signedUploadUrl = await getSignedUploadUrl(gcpStoragePath, { bucket: FACE_GEN_BUCKET_NAME });
        await uploadImageUrlToGCP(prompt.images[0], signedUploadUrl)
        signedUrl = await getSignedUrl(gcpStoragePath, { bucket: FACE_GEN_BUCKET_NAME });
      } catch (ex) {
        console.log("error", ex)
      }

      await db.images.create({
        data: {
          userFaceGenRequestId: request.id,
          imageResult: `${prompt.images[0]}?setNo=${setNo}`,
          gcpStoragePath,
          gcpSignedUrl: signedUrl as string,
          prompt: JSON.stringify(prompt)
        }
      })

      const totalImages = await db.images.count({
        where: {
          userFaceGenRequestId: request.id
        }
      })

      await db.userFaceGenRequests.update({
        where: {
          id: request.id
        },
        data: {
          requestStatus: totalImages >= 3 ? RequestStatusSchema.Values.SUCCESS : RequestStatusSchema.Values.PENDING
        }
      })
    }
  } catch (ex) {
    console.log("error:", ex)

    const request = await db.userFaceGenRequests.findUnique({
      where: {
        id: (requestId!) ?? ""
      }
    });

    if (request?.id) {
      await db.userFaceGenRequests.update({
        where: {
          id: request.id
        },
        data: {
          requestStatus: RequestStatusSchema.Values.FAILED,
          prompt: JSON.stringify(prompt)
        }
      })
    }
  }

  return new Response("success 2", {
    status: 200,
  });
}
