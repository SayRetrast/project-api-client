import type { SignInResponse } from './response';
import type { SignInBody } from '../../models/signInSchema';
import type { ResponseError } from '@/core';

export const signInAPI = async (body: SignInBody) => {
  const response = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + '/api/auth/sign-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData: ResponseError = await response.json();

    throw new Error(errorData.message);
  }

  const successData: SignInResponse = await response.json();

  return successData;
};
