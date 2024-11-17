import { authFetch, type ResponseError } from '@/core';

export const signOutAPI = async (accessToken: string) => {
  const response = await authFetch(accessToken, import.meta.env.VITE_BACKEND_BASE_URL + '/api/auth/sign-out', {
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
