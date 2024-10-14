<script setup lang="ts">
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
</script>

<template>
  <form>
    <div>
      <Label>Username</Label>
      <Input type="text" placeholder="Your username" />
    </div>

    <div>
      <Label>Password</Label>
      <Input type="password" placeholder="Your password" />
    </div>

    <Button class="mt-3 w-full" variant="outline">Sign up</Button>
  </form>
</template>
