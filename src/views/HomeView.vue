<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '@okta/okta-vue';
import { useRouter } from 'vue-router';
import type { Exercise } from "@/model/model";

const userName = ref('');
const isAuthenticated = ref(false);
const $auth = useAuth();
const router = useRouter();

onMounted(async () => {
  try {
    isAuthenticated.value = await $auth.isAuthenticated();
    if (isAuthenticated.value) {
      const userClaims = await $auth.getUser();
      if (userClaims.given_name) {
        userName.value = userClaims.given_name;
      }
    }
  } catch (error) {
    console.error('Failed to fetch user claims:', error);
  }
});

const loginRedirect = () => {
  router.push('/login');
};

const logout = async () => {
  await $auth.signOut();
  isAuthenticated.value = false;
  router.push('/');
};
</script>

<template>
  <div class="greeting">
    <div v-if="isAuthenticated">
      <h4 class="profile-welcome">Hi, {{ userName }}!</h4>
      <button class="btn btn-primary" @click="logout">Logout</button>
    </div>
    <div v-else>
      <h4 class="profile-welcome">Please log in to access the service.</h4>
      <button class="btn btn-primary" @click="loginRedirect">Login</button>
    </div>
  </div>
</template>

<style scoped>
.greeting {
  margin-top: 40px;
  margin-left: -15px;
}
</style>
