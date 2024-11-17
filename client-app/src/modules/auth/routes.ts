import type { RouteRecordRaw } from 'vue-router';
import SignInView from './views/SignInView.vue';
import SignUpView from './views/SignUpView.vue';

export const routes: RouteRecordRaw[] = [
  { path: '/sign-in', name: 'sign-in', component: SignInView },
  { path: '/sign-up', name: 'sign-up', component: SignUpView },
];
