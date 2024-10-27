import z from 'zod';

const responseSchema = {
  204: {},
  '4xx': z.object({
    statusCode: z.number(),
    error: z.string(),
    message: z.string(),
  }),
};

export const signOutSchema = {
  response: responseSchema,
};
