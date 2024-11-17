import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import '@/core/assets/index.css';
import { coreRouter } from './core';
import { VueQueryPlugin } from '@tanstack/vue-query';

const pinia = createPinia();
const app = createApp(App);

app.use(coreRouter);
app.use(pinia);
app.use(VueQueryPlugin);

app.mount('#app');
