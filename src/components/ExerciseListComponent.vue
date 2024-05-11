<script setup lang="ts">
import type {Exercise} from "@/model/model";

const model = defineModel<Exercise[]>()
</script>

<template>
  <div class="exercise-list-container">
    <div class="exercise-item" v-for="exercise in model" :key="exercise.name">
      <div class="exercise-row">
        <div class="exercise-label">Exercise:</div>
        <div class="exercise-value">{{ exercise.name }}</div>
      </div>

      <div class="exercise-row">
        <div class="exercise-label">Sets:</div>
        <div class="exercise-value">{{ exercise.sets }}</div>
      </div>

      <div class="exercise-row">
        <div class="exercise-label">Repetitions:</div>
        <div class="exercise-value">{{ exercise.repetitions }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exercise-list-container {
  margin-top: 20px;
}

.exercise-item {
  margin-bottom: 10px;
}

.exercise-row {
  display: flex;
  margin-bottom: 5px;
}

.exercise-label {
  width: 120px; /* Breite des Labels */
}

@media (max-width: 767px) {
  .exercise-label {
    width: 100px; /* Breite auf auto setzen, um Platz für den Text zuzulassen */
  }
}
</style>
