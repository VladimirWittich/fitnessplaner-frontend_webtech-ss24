import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router';
import AboutView from '@/views/AboutView.vue';
import HomeView from '@/views/HomeView.vue';
import MyProfile from '@/views/MyProfile.vue';
import WorkoutPlan from "@/views/WorkoutPlan.vue";
import HistoryView from "@/views/HistoryView.vue";
import { LoginCallback, navigationGuard } from "@okta/okta-vue";
import LoginView from "@/views/LoginView.vue";
import UserProfileView from "@/views/UserProfileView.vue";

// Router-Definition
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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


// Vor dem Routing-Guard
router.beforeEach(navigationGuard);

export default router;