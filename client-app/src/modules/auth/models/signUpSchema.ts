import { z } from 'zod';

export const signUpSchema = z.object({
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
    .min(8, { message: 'Password must be at least 8 characters long' }),
});
