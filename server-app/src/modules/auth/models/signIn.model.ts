import z from 'zod';

const bodySchema = z.object({
  username: z.string({ required_error: 'Username is required' }).min(1, { message: 'Username is required' }),
  password: z.string({ required_error: 'Password is required' }).min(1, { message: 'Password is required' }),
});

const responseSchema = {
  201: z.object({
    statusCode: z.literal(201),
    accessToken: z.string(),
  }),
  '4xx': z.object({
    statusCode: z.number(),
    error: z.string(),
    message: z.string(),
  }),
};

export const signInSchema = {
  body: bodySchema,
  response: responseSchema,
};

export type SignInBody = z.infer<typeof bodySchema>;
export type SignInResponse = z.infer<(typeof responseSchema)[201]>;
