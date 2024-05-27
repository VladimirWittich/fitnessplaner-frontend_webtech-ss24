import { createRouter, createWebHashHistory } from 'vue-router'; // Beachte die Änderung hier

import AboutView from '@/views/AboutView.vue';
import HomeView from '@/views/HomeView.vue';
import MyProfile from '@/views/MyProfile.vue';
import WorkoutPlan from "@/views/WorkoutPlan.vue";
import HistoryView from "@/views/HistoryView.vue";

const router = createRouter({
  history: createWebHashHistory(), // Ändere createWebHistory zu createWebHashHistory
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/myprofile',
      name: 'MyProfile',
      component: MyProfile
    },
    {
      path: '/workoutplan',
      name: 'workoutplan',
      component: WorkoutPlan
    },
    {
      path: '/history',
      name: 'History',
      component: HistoryView
    }
  ]
});

export default router;
