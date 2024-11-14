<script setup lang="ts">
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { signInSchema } from '../models/signInSchema';
import { useMutation } from '@tanstack/vue-query';
import { signInAPI } from '../api/sign-in/sign-in';
import { jwtDecode } from 'jwt-decode';
import { useUserStore } from '../stores/userStore';
import { useTokenStore } from '../stores/tokenStore';
import { useRouter } from 'vue-router';
import type { UserJwtPayload } from '@/core';

const router = useRouter();

const { setAccessToken } = useTokenStore();
const { setUserInfo } = useUserStore();

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: toTypedSchema(signInSchema),
});

const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');

const signInMutation = useMutation({
  mutationFn: signInAPI,
  onSuccess: () => {
    console.log('User signed in');
  },
});

const onSubmit = handleSubmit(async (data) => {
  try {
    const { accessToken } = await signInMutation.mutateAsync(data);
    const userData = jwtDecode<UserJwtPayload>(accessToken);

    setAccessToken(accessToken);
    setUserInfo({ userId: userData.sub as string, username: userData.username as string });

    router.push({ name: 'main' });
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <form @submit="onSubmit">
    <div>
      <Label>Username</Label>
      <Input type="text" v-model="username" v-bind="usernameAttrs" placeholder="Your username" />
      <div>{{ errors.username }}</div>
    </div>

    <div>
      <Label>Password</Label>
      <Input type="password" v-model="password" v-bind="passwordAttrs" placeholder="Your password" />
      <div>{{ errors.password }}</div>
    </div>

    <Button type="submit" class="mt-3 w-full" variant="outline">Sign in</Button>
  </form>
</template>
