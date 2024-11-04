import type { ResponseError } from '@/core';
import type { RenewTokensResponse } from './response';

export const renewTokensAPI = async () => {
  const response = await fetch('/api/auth/authorize', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData: ResponseError = await response.json();

    throw new Error(errorData.message);
  }

  const successData: RenewTokensResponse = await response.json();

  return successData;
};
