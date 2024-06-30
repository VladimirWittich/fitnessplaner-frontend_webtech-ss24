import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import WorkoutPlan from "@/views/WorkoutPlan.vue";
import HistoryView from "@/views/OverviewView.vue";
import { LoginCallback, navigationGuard } from "@okta/okta-vue";
import LoginView from "@/views/LoginView.vue";
import UserProfileView from "@/views/UserProfileView.vue";
import BMICalculator from "@/views/BMICalculator.vue";

// Router-Definition
const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/bmicalculator',
      name: 'BMI Calculator',
      component: BMICalculator
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
    },
    {
      path: '/login',
      component: LoginView
    },
    {
      path: '/login/callback',
      component: LoginCallback
    },
    {
      path: '/profile',
      name: 'UserProfil',
      component: UserProfileView,
      meta: {
        requiresAuth: true
      }
    }

  ]
});


router.beforeEach(navigationGuard);

export default router;