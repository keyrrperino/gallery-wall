import { UserSchema, db } from 'database';
import { z } from 'zod';
import { protectedProcedure } from '../../../trpc/base';

export const users = protectedProcedure
  .input(
    z.object({
      limit: z.number().optional().default(25),
      offset: z.number().optional().default(0),
      searchTerm: z.string().optional(),
    })
  )
  .output(
    z.object({
      users: z.array(
        UserSchema.pick({
          id: true,
          name: true,
        })
      ),
      total: z.number(),
    })
  )
  .query(async ({ input: { limit, offset, searchTerm } }) => {
    const sanitizedSearchTerm = (searchTerm ?? '').trim().toLowerCase();

    const where = sanitizedSearchTerm
      ? {
          OR: [
            {
              name: {
                contains: sanitizedSearchTerm,
              },
            },
          ],
        }
      : {};

    const users = await db.user.findMany({
      where,
      select: {
        name: true,
        id: true,
      },
      take: limit,
      skip: offset,
    });

    const total = await db.user.count({
      where,
    });

    return {
      users,
      total,
    };
  });
