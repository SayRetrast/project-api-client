import { z } from "zod";

const responseSchema = {
  201: z.object({
    statusCode: z.literal(201),
    registrationLink: z.string(),
  }),
  "5xx": z.object({
    statusCode: z.number(),
    error: z.string(),
    message: z.string(),
  }),
};

export const createRegistrationLinkSchema = {
  response: responseSchema,
};

export type CreateRegistrationLinkResponse = z.infer<(typeof responseSchema)[201]>;
