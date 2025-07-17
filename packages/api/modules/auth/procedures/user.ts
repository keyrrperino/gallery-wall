import { TRPCError } from "@trpc/server";
import { lucia } from "auth";
import { UserFaceGenRequestsSchema, UserSchema, UserTypeSchema, db } from "database";
import { FEMALE, MALE } from "utils";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

const outputSchema = UserSchema.pick({
  id: true,
  name: true,
  gender: true,
  isEighteenAndAbove: true
})
  .extend({
    request: UserFaceGenRequestsSchema.pick({
      id: true,
      requestStatus: true,
      requestType: true,
      imageUrls: true
    }).nullish(),
  })
  .nullable();

export const user = publicProcedure
  .input(z.void())
  .output(
    outputSchema
  )
  .query(
    async ({ ctx: { user } }) => {
      if (!user) {
        return null;
      }

      let requestResult;
      try {
        requestResult = await db.userFaceGenRequests.findFirst({
          where: {
            userId: user?.id
          }
        });
      } catch {
        requestResult = null;
      }

      return {
        id: user?.id ?? "",
        name: user?.name ?? null,
        request: requestResult ?? null,
        gender: user?.gender ?? null,
        isEighteenAndAbove: user?.isEighteenAndAbove ?? false
      };
    });

export const createUser = publicProcedure
  .input(
    z.object({
      gender: z.enum([MALE, FEMALE]),
      name: z.string(),
      isEighteenAndAbove: z.boolean()
    }),
  )
  .output(outputSchema)
  .mutation(
    async ({ ctx: { session, responseHeaders }, input: { gender, name, isEighteenAndAbove } }) => {
      if (session?.id) {
        await lucia.invalidateSession(session?.id);
      }

      const newUser = await db.user.create({
        data: {
          gender,
          name,
          isEighteenAndAbove,
          userType: UserTypeSchema.Values.KIOSK
        },
      });

      console.log("created new user", newUser)

      const newSession = await lucia.createSession(newUser.id, {});

      const sessionCookie = lucia.createSessionCookie(newSession.id);
      responseHeaders?.append("Set-Cookie", sessionCookie.serialize());

      return newUser;
    });


export const updateUser = publicProcedure
  .input(
    z.object({
      gender: z.enum([MALE, FEMALE]),
      name: z.string(),
      isEighteenAndAbove: z.boolean()
    }),
  )
  .output(
    outputSchema
  )
  .mutation(async ({ ctx: { user, session }, input: { gender, name, isEighteenAndAbove } }) => {
    console.log({ session, user })

    if (user) {
      const newUser = await db.user.update({
        where: {
          id: user.id
        },
        data: {
          gender,
          name,
          isEighteenAndAbove
        }
      });

      return newUser;
    }

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "unauthenticated user not allowed",
    });
  })