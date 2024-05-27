<template>
  <div class="container">
    <h4 class="profile-welcome">History Vladimir!</h4>
    <input type="text" v-model="searchQuery" placeholder="Search by name">
    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Sets</th>
        <th>Repetitions</th>
        <th>Weight</th>
        <th>Total Weight</th>
        <th>Date</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in sortedAndFilteredItems" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.sets }}</td>
        <td>{{ item.repetitions }}</td>
        <td>{{ item.weight }}</td>
        <td>{{ item.totalWeight }}</td>
        <td>{{ formatDate(item.createdAt) }}</td>
      </tr>
      </tbody>
    </table>
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

// Filtern und Sortieren der Elemente basierend auf der Suchanfrage
const sortedAndFilteredItems = computed(() => {
  return historyItems.value
      .filter(item => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
      .sort((a, b) => {
        // Zuerst nach Name sortieren
        const nameComparison = a.name.localeCompare(b.name);
        if (nameComparison !== 0) return nameComparison;

        // Dann nach Datum sortieren
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
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
