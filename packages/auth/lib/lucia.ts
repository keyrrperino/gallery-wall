import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "database";
import type { User } from "lucia";
import { Lucia } from "lucia";
import type {
  DatabaseSessionAttributes,
  DatabaseUserAttributes,
} from "../types";

declare module "lucia" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

const prismaClient = new PrismaClient();

const adapter = new PrismaAdapter(prismaClient.userSession, prismaClient.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(data) {
    return data;
  },
  getSessionAttributes: (databaseSession) => {
    return databaseSession;
  },
});

export type SessionUser = User;
export { Scrypt, type Session } from "lucia";
