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
        <td>{{ formatDate(item.createdAt) }}</td>
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
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// Typdefinition für ExerciseItem
interface ExerciseItem {
  id: number;
  name: string;
  sets: number;
  repetitions: string;
  weight: string;
  totalWeight: number;
  createdAt: string; // Expecting an ISO string from the backend
}

const historyItems = ref<ExerciseItem[]>([]);
const searchQuery = ref<string>('');

// Abrufen der Daten beim Komponentenstart
onMounted(async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/workoutplan/all');
    historyItems.value = response.data;
  } catch (error) {
    console.error('Failed to fetch history items:', error);
  }
});

// Filtern der Elemente basierend auf der Suchanfrage
const filteredItems = computed(() => {
  return historyItems.value.filter(item => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// Formatieren des Datums
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // returns YYYY-MM-DD
}
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

.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}
</style>
