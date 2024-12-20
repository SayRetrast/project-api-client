import { z } from 'zod';

export const signUpSchema = z
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

export type SignUpBody = z.infer<typeof signUpSchema>;
