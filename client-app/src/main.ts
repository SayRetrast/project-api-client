import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import '@/core/assets/index.css';
import { coreRouter } from './core';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(coreRouter);

app.mount('#app');
