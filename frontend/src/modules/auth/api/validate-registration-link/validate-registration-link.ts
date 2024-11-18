import { type ResponseError } from '@/core';
import type { ValidateRegistrationLinkResponse } from './response';

export const validateRegistrationLinkAPI = async (registrationKey: string) => {
  const response = await fetch(
    import.meta.env.VITE_BACKEND_BASE_URL + '/api/auth/registration-link?registration-key=' + registrationKey,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData: ResponseError = await response.json();

    throw new Error(errorData.message);
  }

  const successData: ValidateRegistrationLinkResponse = await response.json();

  return successData;
};
