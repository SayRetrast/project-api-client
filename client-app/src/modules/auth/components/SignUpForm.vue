<script setup lang="ts">
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { signUpSchema } from '../models/signUpSchema';

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(signUpSchema),
});

const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit((values) => {
  console.log(values);
});
</script>

<template>
  <form @submit="onSubmit">
    <div>
      <Label>Username</Label>
      <Input
        type="text"
        v-model="username"
        v-bind="usernameAttrs"
        placeholder="Your username"
      />
      <div>{{ errors.username }}</div>
    </div>

    <div>
      <Label>Password</Label>
      <Input
        type="password"
        v-model="password"
        v-bind="passwordAttrs"
        placeholder="Your password"
      />
      <div>{{ errors.password }}</div>
    </div>

    <Button class="mt-3 w-full" variant="outline">Sign up</Button>
  </form>
</template>
