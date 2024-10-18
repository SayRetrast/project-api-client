const bodyJsonSchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
    passwordConfirm: { type: 'string' },
  },
  required: ['username', 'password', 'passwordConfirm'],
  additionalProperties: false,
};

export const signUpSchema = {
  body: bodyJsonSchema,
};
