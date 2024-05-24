// Importieren Sie die notwendigen Module von 'vue-router'
import { createRouter, createWebHistory } from 'vue-router';
// Importieren Sie Ihre View-Komponenten
import HomePage from '@/views/HomeView.vue';
import AboutPage from '@/views/AboutView.vue';

// Definieren Sie Ihre Routen
const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  // Weitere Routen hier
];

// Erstellen Sie den Router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Exportieren Sie den Router, damit er in Ihrer Hauptanwendung verwendet werden kann
export default router;
