import { createWebHistory, createRouter } from 'vue-router';
import { authRoutes } from '@/auth';

export const router = createRouter({
  history: createWebHistory(),
  routes: [...authRoutes],
});
