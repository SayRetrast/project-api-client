<script setup lang="ts">
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { signUpSchema } from '../models/signUpSchema';
import { useTokenStore } from '../stores/tokenStore';
import { useUserStore } from '../stores/userStore';
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { signUpAPI } from '../api/sign-up/sign-up';
import { jwtDecode } from 'jwt-decode';
import type { UserJwtPayload } from '@/core';
import { validateRegistrationLinkAPI } from '../api/validate-registration-link/validate-registration-link';

const router = useRouter();
const route = useRoute();

const registrationKey = route.query['registration-key'];

const { isPending, isError, isSuccess } = useQuery({
  queryKey: ['registration-link', registrationKey],
  queryFn: () => validateRegistrationLinkAPI(registrationKey as string),
  retry: false,
});

const { setAccessToken } = useTokenStore();
const { setUserInfo } = useUserStore();

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(signUpSchema),
});

const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');
const [passwordConfirm, passwordConfirmAttrs] = defineField('passwordConfirm');

const signUpMutation = useMutation({
  mutationFn: (signUpData: { username: string; password: string; passwordConfirm: string }) =>
    signUpAPI(signUpData, registrationKey as string),
  onSuccess: () => {
    console.log('User signed up');
  },
});

const onSubmit = handleSubmit(async (data) => {
  try {
    const { accessToken } = await signUpMutation.mutateAsync(data);
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
  <h1 v-if="isPending">Validating registration link</h1>

  <h1 v-else-if="isError">Registration link is invalid</h1>

  <form v-else-if="isSuccess" @submit="onSubmit">
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

    <div>
      <Label>Confirm password</Label>
      <Input type="password" v-model="passwordConfirm" v-bind="passwordConfirmAttrs" placeholder="Confirm password" />
      <div>{{ errors.passwordConfirm }}</div>
    </div>

    <Button type="submit" class="mt-3 w-full" variant="outline">Sign up</Button>
  </form>
</template>
