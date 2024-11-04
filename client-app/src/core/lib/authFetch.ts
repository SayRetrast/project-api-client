import { renewTokensAPI } from '@/modules/auth';
import type { ResponseError } from '../types/responseError';

export const authFetch = async (accessToken: string, url: string, options?: RequestInit): Promise<Response> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData: ResponseError = await response.json();

    if (errorData.statusCode === 401) {
      const renewTokensResponse = await renewTokensAPI();

      if (renewTokensResponse.statusCode === 200) {
        return authFetch(renewTokensResponse.accessToken, url, options);
      }
    }

    throw new Error(errorData.message);
  }

  return response;
};
