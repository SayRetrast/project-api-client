import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    userId: '',
    username: '',
  });

  const isAuthenticated = computed(() => userInfo.value.userId !== '');

  function setUserInfo({ userId, username }: { userId: string; username: string }) {
    userInfo.value.userId = userId;
    userInfo.value.username = username;
  }

  function clearUserInfo() {
    userInfo.value.userId = '';
    userInfo.value.username = '';
  }

  return {
    userInfo,
    isAuthenticated,
    setUserInfo,
    clearUserInfo,
  };
});
