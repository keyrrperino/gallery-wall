import { FrameSchema, FrameStatusSchema, db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";


export const getFrames = publicProcedure
  .input(z.object({
    userGifRequestId: z.string()
  }))
  .output(
    z.array(
      FrameSchema.pick({
        id: true,
        imageUrl: true
      })
    ).nullable()
  )
  .query(async ({ input: { userGifRequestId } }) => {
    const requestresults = await db
      .frame.findMany({
        where: {
          userGifRequestId: userGifRequestId,
        },
      })

    return requestresults ?? [];
  });

export const addFrame = publicProcedure
  .input(z.object({
    userGifRequestId: z.string(),
    userId: z.string(),
    imageUrl: z.string().optional(),
    frameNumber: z.string(),
    frameStatus: FrameStatusSchema
  }))
  .output(
    z.boolean()
  )
  .mutation(({ input: { userGifRequestId, userId, imageUrl, frameNumber } }) => {
    const id = `${userId}${userGifRequestId}${frameNumber}`;
    db.frame.upsert({
      where: {
        id,
      },
      update: {
        userGifRequestId: userGifRequestId,
        imageUrl: imageUrl,
        frameStatus: FrameStatusSchema.Enum.SUCCESS,
      },
      create: {
        id,
        userGifRequestId: userGifRequestId,
        imageUrl: imageUrl,
        frameStatus: FrameStatusSchema.Enum.SUCCESS,
      }
    }).then(() => {
      console.log('done saving frame: ', id);
    })

    return true;
  });

  export const addFrames = publicProcedure
  .input(z.object({
    userGifRequestId: z.string(),
    userId: z.string(),
    frames: z.array(z.object({
      imageUrl: z.string(),
      frameNumber: z.string()
    }))
  }))
  .output(
    z.boolean()
  )
  .mutation(({ input: { userGifRequestId, userId, frames } }) => {
    frames.forEach((frame) => {
      const {
        frameNumber,
        imageUrl
      } = frame;

      const id = `${userId}${userGifRequestId}${frameNumber}`;
      db.frame.upsert({
        where: {
          id,
        },
        update: {
          userGifRequestId: userGifRequestId,
          imageUrl: imageUrl,
          frameStatus: FrameStatusSchema.Enum.SUCCESS,
        },
        create: {
          id,
          userGifRequestId: userGifRequestId,
          imageUrl: imageUrl,
          frameStatus: FrameStatusSchema.Enum.SUCCESS,
        }
      }).then(() => {
        console.log('done saving frame: ', id);
      })
    })

    return true;
  });
