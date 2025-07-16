import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";
import { getSupabaseSignedUrl } from "storage";

export const supabaseSignedUrl = publicProcedure
  .input(
    z.object({
      bucket: z.string().min(1),
      path: z.string().min(1)
    })
  )
  .mutation(async ({ input: { bucket, path } }) => {
    const url = await getSupabaseSignedUrl(path, { bucket, expiresIn: 86400});
    return { url };
  });