import { FEMALE, MALE } from "utils/constants";
import { z } from "zod";

export const requestBodySchema = z.object({
  gender: z.enum([MALE, FEMALE]),
  name: z.string().min(3),
  attachment: z.string().min(1)
});
