import { createWebHistory, createRouter } from 'vue-router';
import { authRoutes } from '@/modules/auth';
import PageNotFoundView from './views/PageNotFoundView.vue';
import TemporaryMainPageView from './views/TemporaryMainPageView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...authRoutes,
    { path: '/', component: TemporaryMainPageView },
    { path: '/:pathMatch(.*)*', component: PageNotFoundView },
  ],
});
