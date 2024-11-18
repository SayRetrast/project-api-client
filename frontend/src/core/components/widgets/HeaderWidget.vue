<script setup lang="ts">
import { useTokenStore, useUserStore } from '@/modules/auth';
import { Button } from '../ui/button';
import { signOutAPI } from '@/modules/auth/api/sign-out/sign-out';
import { useRouter } from 'vue-router';

const router = useRouter();

const tokenStore = useTokenStore();
const userStore = useUserStore();

const SignOutHandler = async () => {
  try {
    await signOutAPI(tokenStore.accessToken);

    tokenStore.clearAccessToken();
    userStore.clearUserInfo();

    router.push({ name: 'sign-in' });
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="flex h-16 items-center justify-between px-4">
    <p>{{ userStore.userInfo.username }}</p>
    <Button @click="SignOutHandler">Sign out</Button>
  </div>
</template>
