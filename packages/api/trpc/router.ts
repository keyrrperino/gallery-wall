import type { } from "@prisma/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import * as adminProcedures from "../modules/admin/procedures";
import * as aiProcedures from "../modules/ai/procedures";
import * as authProcedures from "../modules/auth/procedures";
import * as emailProcedures from "../modules/emails/procedures";
import * as imagesProcedures from "../modules/images/procedures";
import * as uploadsProcedures from "../modules/uploads/procedures";
import { router } from "./base";

export const apiRouter = router({
  auth: router(authProcedures),
  ai: router(aiProcedures),
  images: router(imagesProcedures),
  emails: router(emailProcedures),
  admin: router(adminProcedures),
  uploads: router(uploadsProcedures)
});

export type ApiRouter = typeof apiRouter;
export type ApiInput = inferRouterInputs<ApiRouter>;
export type ApiOutput = inferRouterOutputs<ApiRouter>;
