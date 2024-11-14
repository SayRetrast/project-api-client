<script setup lang="ts">
import { useUserStore } from '@/modules/auth';

const userStore = useUserStore();
</script>

<template>
  <div class="mt-72 text-center text-2xl">
    <h1>Main page</h1>
    <p>{{ userStore.userInfo.username }}</p>
  </div>
</template>
