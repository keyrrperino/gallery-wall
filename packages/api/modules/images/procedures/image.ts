import { FrameSchema, db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";


export const getImages = publicProcedure
  .input(z.object({
    userRequestId: z.string()
  }))
  .output(
    z.array(
      FrameSchema.pick({
        id: true,
      })
    ).nullable()
  )
  .query(async ({ input: { userRequestId } }) => {
    const requestresults = await db
      .frame.findMany({
        where: {
          userRequestId: userRequestId,
        },
      })

    return requestresults ?? [];
  });
