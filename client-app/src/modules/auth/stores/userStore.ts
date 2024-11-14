import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    userId: '',
    username: '',
  });

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
    setUserInfo,
    clearUserInfo,
  };
});
