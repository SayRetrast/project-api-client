import { createWebHistory, createRouter } from 'vue-router';
import { authRoutes } from '@/modules/auth';
import PageNotFoundView from './views/PageNotFoundView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...authRoutes,
    { path: '/:pathMatch(.*)*', component: PageNotFoundView },
  ],
});
