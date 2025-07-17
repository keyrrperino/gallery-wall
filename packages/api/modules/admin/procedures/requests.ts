import { UserFaceGenRequestsSchema, db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const requests = publicProcedure
  .input(
    z.object({
      limit: z.number().optional().default(25),
      offset: z.number().optional().default(0),
      searchTerm: z.string().optional(),
    }),
  )
  .output(
    z.object({
      requests: z.array(
        UserFaceGenRequestsSchema.pick({
          imageUrls: true,
          requestStatus: true,
          requestType: true,
          id: true,
        })
      ),
      total: z.number(),
    }),
  )
  .query(async ({ input: { limit, offset, searchTerm } }) => {
    const sanitizedSearchTerm = (searchTerm ?? "").trim().toLowerCase();

    const where = sanitizedSearchTerm
      ? {
        OR: [
          {
            facebookUserId: {
              contains: sanitizedSearchTerm,
            },
          },
          {
            facebookUserId: {
              contains: sanitizedSearchTerm,
            },
          },
        ],
      }
      : {};

    const requests = await db.userFaceGenRequests.findMany({
      where,
      select: {
        imageUrls: true,
        requestStatus: true,
        requestType: true,
        id: true,
      },
      take: limit,
      skip: offset,
    });

    const total = await db.userFaceGenRequests.count({
      where,
    });

    return {
      requests,
      total,
    };
  });
