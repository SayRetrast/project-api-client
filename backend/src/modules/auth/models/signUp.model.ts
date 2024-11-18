import z from 'zod';

const querySchema = z.object({
  'registration-key': z.string({ required_error: 'Registration key is required' }),
});

const bodySchema = z
  .object({
    username: z
      .string({ required_error: 'Username is required' })
      .min(1, { message: 'Username is required' })
      .max(255, { message: 'Username is too long' })
      .regex(/^[a-zA-Z0-9]*$/, {
        message: 'Username can only contain letters and numbers',
      }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/^\S*$/, {
        message: 'Password cannot contain spaces',
      }),
    passwordConfirm: z
      .string({ required_error: 'Password confirmation is required' })
      .min(1, { message: 'Password confirmation is required' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
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
  '5xx': z.object({
    statusCode: z.number(),
    error: z.string(),
    message: z.string(),
  }),
};

export const signUpSchema = {
  querystring: querySchema,
  body: bodySchema,
  response: responseSchema,
};

export type SignUpBody = z.infer<typeof bodySchema>;
export type SignUpQuery = z.infer<typeof querySchema>;
export type SignUpResponse = z.infer<(typeof responseSchema)[201]>;
