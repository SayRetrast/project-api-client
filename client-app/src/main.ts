import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '@/core/assets/index.css';
import { coreRouter } from './core';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from '@/App.vue';

const pinia = createPinia();
const app = createApp(App);

app.use(coreRouter);
app.use(pinia);
app.use(VueQueryPlugin);

app.mount('#app');
