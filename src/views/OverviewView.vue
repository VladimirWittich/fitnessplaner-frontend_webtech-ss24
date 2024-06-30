<template>
  <div class="container">
    <h4 class="profile-welcome">Your overview, {{ userName }}!</h4>
    <input type="text" v-model="searchQuery" placeholder="Search by name">

    <div v-if="isLoading">
      <p>Loading...</p>
    </div>
    <table v-else-if="filteredItems.length > 0" class="table">
      <thead>
      <tr>
        <th>Date</th>
        <th>Exercise Name</th>
        <th>Sets</th>
        <th>Repetitions</th>
        <th>Weight (kg)</th>
        <th>Total Weight (kg)</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in filteredItems" :key="index">
        <td>{{ item.createdAt }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.sets }}</td>
        <td>{{ item.repetitions }}</td>
        <td>{{ item.weight }}</td>
        <td>{{ item.totalWeight > 0 ? item.totalWeight : '-' }}</td>
      </tr>
      </tbody>
    </table>
    <div v-else-if="showNoResultsMessage">
      <p>No exercises found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuth } from '@okta/okta-vue';
import { useRouter } from 'vue-router';

interface ExerciseItem {
  id: number;
  name: string;
  sets: number;
  repetitions: number;
  weight: number;
  totalWeight: number;
  createdAt: string;
}

const historyItems = ref<ExerciseItem[]>([]);
const searchQuery = ref<string>('');
const router = useRouter();
const isAuthenticated = ref(false);
const isLoading = ref(true); // Start with loading state true
const $auth = useAuth();
let userName = ref('');
let timer: number | null = null;
const TIMEOUT_DURATION = 10000; // 10 seconds

const fetchHistoryData = async () => {
  try {
    const token = await $auth.getAccessToken();
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/workoutplan/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    historyItems.value = response.data; // assuming response.data is an array of ExerciseItem
    isLoading.value = false; // Set loading state to false after fetching data
    clearTimeout(timer); // Clear timeout when data is loaded
  } catch (error) {
    console.error('Failed to fetch history data:', error);
    isLoading.value = false; // Set loading state to false on error
  }
};

const filteredItems = computed(() => {
  const items = Array.isArray(historyItems.value) ? historyItems.value : [];
  return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const startTimeoutTimer = () => {
  timer = window.setTimeout(() => {
    isLoading.value = false; // Set loading state to false after timeout
    clearTimeout(timer); // Clear timeout
    timer = null;
  }, TIMEOUT_DURATION);
};

onMounted(async () => {
  try {
    isAuthenticated.value = await $auth.isAuthenticated();
    if (isAuthenticated.value) {
      const userClaims = await $auth.getUser();
      if (userClaims.given_name) {
        userName.value = userClaims.given_name;
      }
      fetchHistoryData(); // Fetch history data if authenticated
      startTimeoutTimer(); // Start timeout timer

      // Additional logic to fetch workout plan data
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/workoutplan/all');
      historyItems.value = response.data;
      clearTimeout(timer); // Clear timeout if data fetch finishes before timeout
    }
  } catch (error) {
    console.error('Failed to fetch user claims or history data:', error);
    isLoading.value = false; // Set loading state to false on error
  }
});

const showNoResultsMessage = computed(() => {
  return !isLoading.value && filteredItems.value.length === 0 && !timer;
});

</script>

<style scoped>
.container {
  margin-top: 40px;
  margin-left: -15px;
}

.table {
  margin-top: 40px;
  margin-left: 0px;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}
</style>
