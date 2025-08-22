import { TRPCError } from '@trpc/server';
import { lucia } from 'auth';
import { z } from 'zod';
import { publicProcedure } from '../../../trpc/base';

export const logout = publicProcedure
  .input(z.void())
  .mutation(async ({ ctx: { session, responseHeaders } }) => {
    try {
      if (!session?.id) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Session or session ID is undefined.',
        });
      }

      await lucia.invalidateSession(session.id);
      const sessionCookie = lucia.createBlankSessionCookie();
      responseHeaders?.append('Set-Cookie', sessionCookie.serialize());
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unknown error occurred.',
      });
    }
  });
