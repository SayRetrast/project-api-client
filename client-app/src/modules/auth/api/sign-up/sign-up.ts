import type { ResponseError } from '@/core';
import type { SignUpBody } from '../../models/signUpSchema';
import type { SignUpResponse } from './response';

export const signUpAPI = async (body: SignUpBody, registrationKey: string) => {
  const response = await fetch(
    import.meta.env.VITE_BACKEND_BASE_URL + '/api/auth/sign-up?registration-key=' + registrationKey,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorData: ResponseError = await response.json();

    throw new Error(errorData.message);
  }

  const successData: SignUpResponse = await response.json();

  return successData;
};
