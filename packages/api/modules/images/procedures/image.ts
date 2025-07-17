import { ImagesSchema, db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";


export const getImages = publicProcedure
  .input(z.object({
    userFaceGenRequestId: z.string()
  }))
  .output(
    z.array(
      ImagesSchema.pick({
        id: true,
        userFaceGenRequestId: true,
        imageResult: true,
        gcpSignedUrl: true,
        gcpStoragePath: true
      })
    ).nullable()
  )
  .query(async ({ input: { userFaceGenRequestId } }) => {
    const requestresults = await db
      .images.findMany({
        where: {
          userFaceGenRequestId: userFaceGenRequestId,
        },
      })

    return requestresults ?? [];
  });
