import { createWebHistory, createRouter } from 'vue-router';
import { authRoutes, useUserStore } from '@/modules/auth';
import PageNotFoundView from './views/PageNotFoundView.vue';
import TemporaryMainPageView from './views/TemporaryMainPageView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...authRoutes,
    { path: '/', name: 'main', component: TemporaryMainPageView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFoundView },
  ],
});

router.beforeEach((to) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isAuthenticated;

  if (to.name !== 'sign-in' && to.name !== 'sign-up') {
    if (!isAuthenticated) {
      return { path: '/sign-in' };
    }
  }

  if (to.name === 'sign-in' || to.name === 'sign-up') {
    if (isAuthenticated) {
      return { path: '/' };
    }
  }
});
