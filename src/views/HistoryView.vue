<template>
  <div class="container">
    <h4 class="profile-welcome">History Vladimir!</h4>
    <ul>
      <li v-for="item in historyItems" :key="item.id">
        {{ item.name }} - Sets: {{ item.sets }}, Repetitions: {{ item.repetitions }}, Weight: {{ item.weight }}, Total Weight: {{ item.totalWeight }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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

// Abrufen der Daten beim Komponentenstart
onMounted(async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/workoutplan/all');
    historyItems.value = response.data;
  } catch (error) {
    console.error('Failed to fetch history items:', error);
  }
});
</script>

<style scoped>
.container {
  margin-top: 50px;
  margin-left: auto;
}
</style>
