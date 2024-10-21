import z from 'zod';

const bodyJsonSchema = z.object({
  username: z.string({ required_error: 'Username is required' }).min(1, { message: 'Username is required' }),
  password: z.string({ required_error: 'Password is required' }).min(1, { message: 'Password is required' }),
});

export const signInSchema = {
  body: bodyJsonSchema,
};

export type SignInDto = z.infer<typeof bodyJsonSchema>;
