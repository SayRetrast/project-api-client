import { authFetch, type ResponseError } from '@/core';

export const signOutAPI = async (accessToken: string) => {
  const response = await authFetch(accessToken, '/api/auth/sign-out', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData: ResponseError = await response.json();

    throw new Error(errorData.message);
  }
};
