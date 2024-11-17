import { createWebHistory, createRouter } from 'vue-router';
import { authRoutes, renewTokensAPI, useTokenStore, useUserStore } from '@/modules/auth';
import PageNotFoundView from './views/PageNotFoundView.vue';
import { jwtDecode } from 'jwt-decode';
import TemporaryMainPageView from './views/TemporaryMainPageView.vue';
import CoreLayout from './layouts/CoreLayout.vue';
import type { UserJwtPayload } from './lib/interfaces';

const protectedRoutesHandler = () => {
  const userStore = useUserStore();
  if (!userStore.isAuthenticated) {
    return { path: '/sign-in' };
  }
};

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...authRoutes,
    {
      path: '/',
      component: CoreLayout,
      beforeEnter: protectedRoutesHandler,
      children: [{ path: '', name: 'main', component: TemporaryMainPageView }],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFoundView },
  ],
});

const authorizeUser = async (
  setUserInfo: (userInfo: { userId: string; username: string }) => void,
  setAccessToken: (accessToken: string) => void
) => {
  try {
    const { accessToken } = await renewTokensAPI();
    const userData = jwtDecode<UserJwtPayload>(accessToken);

    setAccessToken(accessToken);
    setUserInfo({ userId: userData.sub as string, username: userData.username as string });
  } catch (error) {
    console.error(error);
  }
};

router.beforeEach(async (to) => {
  const { setAccessToken } = useTokenStore();
  const userStore = useUserStore();

  let isAuthenticated = userStore.isAuthenticated;
  if (isAuthenticated) {
    if (to.name === 'sign-in' || to.name === 'sign-up') {
      return { path: '/' };
    }

    return;
  }

  await authorizeUser(userStore.setUserInfo, setAccessToken);
  isAuthenticated = userStore.isAuthenticated;
});
