<template>
  <div class="exercise-list-container">
    <!-- Container wird nur angezeigt, wenn mindestens eine Übung vorhanden ist -->
    <div v-if="model && model.length > 0" class="container bg-light-gray p-4">
      <div class="exercise-item" v-for="(exercise, index) in model" :key="index">
        <div class="exercise-row">
          <div class="exercise-label">Exercise name:</div>
          <div class="exercise-value">{{ exercise.name }}</div>
        </div>

        <div class="exercise-row">
          <div class="exercise-label exercise-label-sets">Sets:</div>
          <div class="exercise-value">
            <input type="number" v-model="exercise.sets" @change="onSetsChange(index, exercise.sets)">
          </div>
        </div>


        <!-- Dynamisch generierte Felder für Repetitions und Gewicht -->
        <template v-if="exercise.sets && exercise.repetitions">
          <template v-for="(repetition, repetitionIndex) in exercise.repetitions" :key="repetitionIndex">
            <div class="exercise-row">
              <div class="exercise-label">Repetitions {{ repetitionIndex + 1 }}:</div>
              <div class="exercise-value">
                <input type="number" v-model="exercise.repetitions[repetitionIndex]" @input="updateTotalWeight()">
              </div>
              <div class="exercise-label">Weight:</div>
              <div class="exercise-value">
                <input type="number" v-model="exercise.weight[repetitionIndex]" @input="updateTotalWeight()">
              </div>
            </div>
          </template>
        </template>

        <div class="exercise-row">
          <div class="exercise-label">Total weight:</div>
          <div class="exercise-value">{{ calculateTotalWeight(exercise) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineModel } from 'vue'
import type { Exercise } from "@/model/model";
import axios from 'axios';

const model = defineModel<Exercise[] | undefined>()

const generateRepetitionsArray = (sets: number) => {
  return new Array(sets).fill(0); // Erzeugt ein Array mit der Länge von "sets" und füllt es mit Nullen
}

const fetchData = () => {
  axios.get('https://fitnessplaner-backend-webtech-ss24.onrender.com/workoutplan')
      .then(response => {
        model.value = response.data;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
}

const onSetsChange = (index: number, newSets: number) => {
  if (model.value) {
    model.value[index].repetitions = generateRepetitionsArray(newSets);
  }
}

const updateTotalWeight = () => {
  if (model.value) {
    model.value.forEach((exercise) => {
      exercise.totalweight = calculateTotalWeight(exercise);
    });
  }
};

const calculateTotalWeight = (exercise: Exercise) => {
  let totalWeight = 0;
  for (let i = 0; i < exercise.repetitions.length; i++) {
    totalWeight += (exercise.repetitions[i] || 0) * (exercise.weight[i] || 0);
  }
  return totalWeight;
};

fetchData(); // Daten beim Laden der Komponente abrufen

</script>

<style scoped>
.exercise-list-container {
  margin-top: 20px;
}

.bg-light-gray {
  background-color: #f8f9fa; /* Hintergrundfarbe grau */
}

.exercise-item {
  margin-bottom: 10px;
}

.exercise-value input[type="number"] {
  width: 80%;
  margin-bottom: 10px; /* Fügt einen zusätzlichen Abstand zwischen dem Label und dem Eingabefeld hinzu */
}

.exercise-row {
  display: flex;
  margin-bottom: 5px;
}

.exercise-value {
  flex: 1; /* Verteilt den verfügbaren Platz zwischen dem Label und dem Eingabefeld */
}

.exercise-label {
  min-width: 120px; /* Mindestbreite des Labels */
}

/* Für kleinere Bildschirme */
@media (max-width: 767px) {
  .exercise-label {
    min-width: auto; /* Mindestbreite auf auto setzen, um Platz für den Text zuzulassen */
  }
  .exercise-value input[type="number"] {
    width: 100%; /* Die Breite des Eingabefelds auf 100% setzen, um den verfügbaren Platz auszufüllen */
  }
}

</style>
