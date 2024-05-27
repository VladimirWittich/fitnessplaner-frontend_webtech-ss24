<template>
  <div class="container">
    <h4 class="profile-welcome">History Vladimir!</h4>
    <input type="text" v-model="searchQuery" placeholder="Search by name">
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }} - Sets: {{ item.sets }}, Repetitions: {{ item.repetitions }}, Weight: {{ item.weight }}, Total Weight: {{ item.totalWeight }}
      </li>
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
}

// Verwendung von ExerciseItem als Typ für historyItems
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
</script>

<style scoped>
.container {
  margin-top: 50px;
  margin-left: auto;
}
</style>
