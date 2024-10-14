import { createApp } from 'vue';
import App from '@/App.vue';
import '@/core/assets/index.css';
import { coreRouter } from './core';

const app = createApp(App);

app.use(coreRouter);
app.mount('#app');
