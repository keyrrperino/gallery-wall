import { UserFaceGenRequestsSchema, UserSessionSchema, db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const request = publicProcedure
  .input(z.void())
  .output(
    UserFaceGenRequestsSchema.pick({
      id: true,
      requestStatus: true,
      requestType: true,
      imageUrls: true,
    })
      .extend({
        session: UserSessionSchema.pick({
          id: true,
          createdAt: true,
          expiresAt: true
        }).nullish(),
      })
      .nullable(),
  )
  .query(async ({ ctx: { session } }) => {
    if (!session) {
      return null;
    }

    const requestresult = session?.id
      ? await db.userFaceGenRequests.findFirst({
        where: {
          userId: session.userId,
        },
      })
      : null; // return null instead of undefined

    return requestresult;
  });
