<template>
  <div class="container">
    <h4 class="profile-welcome">Your overview</h4>
    <input type="text" v-model="searchQuery" placeholder="Search by name">

    <div v-if="isLoading">
      <p>Loading...</p>
    </div>
    <table v-else-if="filteredItems.length > 0" class="table">
      <thead>
      <tr>
        <th class="column-date">Date</th>
        <th class="column-name">Exercise Name</th>
        <th class="column-sets">Sets</th>
        <th class="column-repetitions">Repetitions</th>
        <th class="column-weight">Weight (kg)</th>
        <th class="column-total-weight">Total Weight (kg)</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in filteredItems" :key="index">
        <td>{{ item.createdAt }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.sets }}</td>
        <td>{{ item.repetitions }}</td>
        <td>{{ item.weight.map(w => w.toLocaleString('de-DE', { minimumFractionDigits: 2 })).join(', ') }} kg</td>
        <td>
          {{ item.totalWeight > 0 ? item.totalWeight.toLocaleString('de-DE', { minimumFractionDigits: 2 }) : '-' }}
        </td>
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
const isLoading = ref(true);
const $auth = useAuth();
let userName = ref('');
let timer: number | null = null;
const TIMEOUT_DURATION = 10000;

const fetchHistoryData = async () => {
  try {
    const token = await $auth.getAccessToken();
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/workoutplan/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    historyItems.value = response.data;
    isLoading.value = false;
    clearTimeout(timer);
  } catch (error) {
    console.error('Failed to fetch history data:', error);
    isLoading.value = false;
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
    isLoading.value = false;
    clearTimeout(timer);
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
      fetchHistoryData();
      startTimeoutTimer();

      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/workoutplan/all');
      historyItems.value = response.data;
      clearTimeout(timer);
    }
  } catch (error) {
    console.error('Failed to fetch user claims or history data:', error);
    isLoading.value = false;
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
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  white-space: nowrap;
}

.table th {
  background-color: #f2f2f2;
}

.column-date {
  width: 150px !important;
}

.column-name {
  width: 200px !important;
}

.column-sets {
  width: 50px !important;
}

.column-repetitions {
  width: 100px !important;
}

.column-weight {
  width: 80px !important;
}

.column-total-weight {
  width: 100px !important;
}
</style>
