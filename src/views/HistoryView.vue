<template>
  <div class="container">
    <h4 class="profile-welcome">History Vladimir!</h4>
    <input type="text" v-model="searchQuery" placeholder="Search by name">
    <ul>
      <li v-if="filteredItems.length === 0">No exercises found</li>
      <template v-for="(item, index) in filteredItems" :key="index">
        <template v-if="index === 0 || item.name !== filteredItems[index - 1].name">
          <li>{{ item.name }}</li>
        </template>
        <li>
          <div>Sets: {{ item.sets }}</div>
          <div>Repetitions: {{ item.repetitions }}</div>
          <div>Weight: {{ item.weight }}</div>
          <div>Total Weight: {{ item.totalWeight }}</div>
          <div>Date: {{ formatDate(item.createdAt) }}</div>
        </li>
      </template>
    </ul>
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
  return date.toLocaleDateString(); // Gibt nur das Datum zurück
}
</script>

<style scoped>
.container {
  margin-top: 50px;
  margin-left: auto;
}
</style>
