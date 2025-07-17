import { OAuth2RequestError } from "arctic";
import { UserTypeSchema, db } from "database";
import { cookies } from "next/headers";
import { lucia } from "./lucia";

export function createOauthRedirectHandler(
  providerId: string,
  createAuthorizationTokens: () => Promise<{
    state: string;
    codeVerifier?: string;
    url: URL;
  }>,
) {
  return async function () {
    const { url, state, codeVerifier } = await createAuthorizationTokens();

    cookies().set(`${providerId}_oauth_state`, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      path: "/",
      maxAge: 60 * 60,
      sameSite: "lax",
    });

    if (codeVerifier) {
      // store code verifier as cookie
      cookies().set("code_verifier", codeVerifier, {
        secure: true, // set to false in localhost
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10, // 10 min
      });
    }

    return Response.redirect(url);
  };
}

export function createOauthCallbackHandler(
  providerId: string,
  validateAuthorizationCode: (
    code: string,
    codeVerifier?: string,
  ) => Promise<{
    email: string;
    name?: string;
    id: string;
    avatar?: string;
  }>,
) {
  return async function (req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState =
      cookies().get(`${providerId}_oauth_state`)?.value ?? null;
    const storedCodeVerifier = cookies().get("code_verifier")?.value ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      return new Response(null, {
        status: 400,
      });
    }

    try {
      const oauthUser = await validateAuthorizationCode(
        code,
        storedCodeVerifier ?? undefined,
      );

      const existingUser = await db.user.findFirst({
        where: {
          id: oauthUser.id
        },
        select: {
          id: true,
          name: true
        },
      });

      if (existingUser) {
        const session = await lucia.createSession(existingUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/app",
          },
        });
      }

      const newUser = await db.user.create({
        data: {
          name: oauthUser.name ?? "",
          userType: UserTypeSchema.Values.KIOSK
        },
      });

      const session = await lucia.createSession(newUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/app",
        },
      });
    } catch (e) {
      console.error(e);
      if (e instanceof OAuth2RequestError) {
        return new Response(null, {
          status: 400,
        });
      }

      return new Response(null, {
        status: 500,
      });
    }
  };
}
