import type { inferAsyncReturnType } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { lucia } from 'auth';
import { cookies } from 'next/headers';

export async function createContext(
  params?: FetchCreateContextFnOptions | { isAdmin?: boolean }
) {
  console.log('lucia.sessionCookieName: ', lucia.sessionCookieName);
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  console.log('sessionId: ', sessionId);

  let luciaSession;

  try {
    luciaSession = sessionId
      ? await lucia.validateSession(sessionId)
      : { user: null, session: null };
  } catch {
    luciaSession = { user: null, session: null };
  }

  return {
    user: luciaSession?.user,
    session: luciaSession?.session,
    responseHeaders:
      params && 'resHeaders' in params ? params.resHeaders : undefined,
    req: params && 'req' in params ? params.req : undefined,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
