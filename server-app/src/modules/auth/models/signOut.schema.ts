import z from 'zod';

const paramsJsonSchema = z.object({
  userId: z.string({ required_error: 'userId is required' }).min(1, { message: 'userId is required' }),
});

export const signOutSchema = {
  params: paramsJsonSchema,
};

export type SignOutParams = z.infer<typeof paramsJsonSchema>;
