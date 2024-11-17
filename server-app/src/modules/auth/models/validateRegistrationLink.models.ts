import z from 'zod';

const querySchema = z.object({
  'registration-key': z.string({ required_error: 'Registration key is required' }),
});

const responseSchema = {
  200: z.object({
    statusCode: z.literal(200),
    message: z.string(),
  }),
  '4xx': z.object({
    statusCode: z.number(),
    error: z.string(),
    message: z.string(),
  }),
  '5xx': z.object({
    statusCode: z.number(),
    error: z.string(),
    message: z.string(),
  }),
};

export const validateRegistrationLinkSchema = {
  querystring: querySchema,
  response: responseSchema,
};

export type ValidateRegistrationLinkQuery = z.infer<typeof querySchema>;
export type ValidateRegistrationLinkResponse = z.infer<(typeof responseSchema)[200]>;
