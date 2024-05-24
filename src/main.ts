import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importieren des Routers

const app = createApp(App);

app.use(router); // Verwenden des Routers

app.mount('#app');
