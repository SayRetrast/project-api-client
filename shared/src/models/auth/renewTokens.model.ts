import { z } from "zod";

const responseSchema = {
  200: z.object({
    statusCode: z.literal(200),
    accessToken: z.string(),
  }),
  "4xx": z.object({
    statusCode: z.number(),
    error: z.string(),
    message: z.string(),
  }),
  "5xx": z.object({
    statusCode: z.number(),
    error: z.string(),
    message: z.string(),
  }),
};

export const renewTokensSchema = {
  response: responseSchema,
};

export type RenewTokensResponse = z.infer<(typeof responseSchema)[200]>;
