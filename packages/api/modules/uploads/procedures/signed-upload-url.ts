import { TRPCError } from "@trpc/server";
import { getSignedUploadUrl } from "storage";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const signedUploadUrl = publicProcedure
	.input(
		z.object({
			bucket: z.string().min(1),
			path: z.string().min(1),
		}),
	)
	.mutation(async ({ input: { bucket, path } }) => {
		// ATTENTION: be careful with how you give access to write to the storage
		// always check if the user has the right to write to the desired bucket before giving them a signed url

		if (bucket === "gifs") {
			return await getSignedUploadUrl(path, { bucket });
		}

		throw new TRPCError({
			code: "FORBIDDEN",
		});
	});
