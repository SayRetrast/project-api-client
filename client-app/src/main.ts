import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import '@/core/assets/index.css';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { CoreRouter } from './core';

const pinia = createPinia();
const app = createApp(App);

app.use(CoreRouter);
app.use(pinia);
app.use(VueQueryPlugin);

app.mount('#app');
