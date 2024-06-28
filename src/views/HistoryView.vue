<template>
  <div class="container">
    <h4 class="profile-welcome">History Vladimir!</h4>
    <input type="text" v-model="searchQuery" placeholder="Search by name">

    <table v-if="filteredItems.length > 0" class="table">
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
    <div v-else>
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
const $auth = useAuth();

const fetchHistoryData = async () => {
  try {
    const token = await $auth.getAccessToken();
    if (!token) {
      console.error('Authorization token not available.');
      router.push('/login');
      return;
    }

    isAuthenticated.value = await $auth.isAuthenticated();
    if (!isAuthenticated.value) {
      router.push('/login');
      return;
    }

    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/workoutplan/history', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('API response:', response.data);
    historyItems.value = Array.isArray(response.data) ? response.data : [];

  } catch (error) {
    console.error('Failed to fetch history items:', error);
    if (error.response && error.response.status === 401) {
      router.push('/login');
    } else {
      console.error('Error fetching history:', error);
    }
  }
};

const filteredItems = computed(() => {
  const items = Array.isArray(historyItems.value) ? historyItems.value : [];
  return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(fetchHistoryData);

</script>

<style scoped>
.container {
  margin-top: 50px;
  margin-left: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  margin-left: 100px;
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
