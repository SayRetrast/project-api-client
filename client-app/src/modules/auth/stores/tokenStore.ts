import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTokenStore = defineStore('token', () => {
  const accessToken = ref('');

  function setAccessToken(token: string): void {
    accessToken.value = token;
  }

  function clearAccessToken(): void {
    accessToken.value = '';
  }

  return {
    accessToken,
    setAccessToken,
    clearAccessToken,
  };
});
