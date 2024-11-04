import { authFetch, type ResponseError } from '@/core';
import type { CreateRegistrationLinkResponse } from './response';

export const createRegistrationLinkAPI = async (accessToken: string) => {
  const response = await authFetch(accessToken, '/api/auth/registration-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData: ResponseError = await response.json();

    throw new Error(errorData.message);
  }

  const successData: CreateRegistrationLinkResponse = await response.json();

  return successData;
};
