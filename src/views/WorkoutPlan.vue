<template>
  <!-- Vertikale Anordnung -->
  <div class="container">
    <h4 class="profile-welcome">You can do it Vladimir!</h4>
    <div>
      <h6 class="add-progress" style="text-align: left;">Add your progress for today!</h6>
    </div>

    <!-- Vertikale Anordnung der Inhalte -->
    <div class="exercise-list-container">
      <ExerciseListComponent v-model="exercise"></ExerciseListComponent>
      <button class="btn btn-primary" v-if="exercise && exercise.length > 0" @click="deleteExercise(0)">Delete Exercise</button>

      <div class="new-exercise-form">
        <div class="container bg-light-gray p-4">
          <label>Exercise name:</label>
          <input type="text" v-model="newExercise.name" placeholder="Type in exercise name">

          <label>Sets:</label>
          <input type="number" v-model="newExercise.sets" @change="updateRepetitions(newExercise.sets)">

          <!-- Dynamisch generierte Repetitions-Felder -->
          <template v-if="displayRepetitionsInput">
            <div v-for="(repetition, index) in newExercise.repetitions" :key="index">
              <label>Repetitions {{ index + 1 }}</label>
              <input type="number" v-model="newExercise.repetitions[index]">
            </div>
          </template>

          <!-- Gewichtsfelder -->
          <template v-if="displayWeightInput">
            <div v-for="(repetition, index) in newExercise.repetitions" :key="index">
              <label>Weight {{ index + 1 }}</label>
              <input type="number" v-model="newExercise.weight[index]" @input="updateTotalWeight()">
            </div>
          </template>
        </div>

        <button class="btn btn-primary" @click="addNewExercise()">Add Exercise</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import type { Exercise } from "@/model/model";
import ExerciseListComponent from "@/components/ExerciseListComponent.vue";

// Refs für Übungen und neue Übung erstellen
const exercise = ref<Exercise[]>([]);
const newExercise = ref<Exercise>({
  name: '',
  sets: 0,
  repetitions: [],
  weight: [],
  totalweight: 0
});

// Funktion zum Löschen einer Übung
function deleteExercise(index: number) {
  if (exercise.value) {
    exercise.value.splice(index, 1);
  }
}

// Funktion zum Aktualisieren der Anzahl der Wiederholungen
const updateRepetitions = (value: number) => {
  newExercise.value.repetitions = new Array(value).fill(0);
};

// Variablen für die Anzeige der Eingabefelder initialisieren
const displayRepetitionsInput = ref(false);
const displayWeightInput = ref(false);

// Funktion zum Hinzufügen einer neuen Übung
const addNewExercise = () => {
  if (newExercise.value.name && newExercise.value.sets > 0) {
    exercise.value.push(newExercise.value);
    newExercise.value = {
      name: '',
      sets: 0,
      repetitions: [],
      weight: [],
      totalweight: 0
    };
  }
};

// Funktion zum Aktualisieren des Gesamtgewichts
const updateTotalWeight = () => {
  if (exercise.value) {
    exercise.value.forEach((exercise) => {
      exercise.totalweight = calculateTotalWeight(exercise);
    });
  }
};

// Funktion zur Berechnung des Gesamtgewichts
const calculateTotalWeight = (exercise: Exercise) => {
  let totalWeight = 0;
  for (let i = 0; i < exercise.repetitions.length; i++) {
    totalWeight += (exercise.repetitions[i] || 0) * (exercise.weight[i] || 0);
  }
  return totalWeight;
};



const fetchData = () => {
  const endpoint = 'https://fitnessplaner-backend-webtech-ss24.onrender.com/workoutplan';
  axios.get(endpoint)
      .then(response => {
        const data = response.data;
        if (data && data.length > 0) {
          const firstExercise = data[0];
          newExercise.value.name = firstExercise.name;
          newExercise.value.sets = firstExercise.sets;
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
};

onMounted(() => {
  fetchData();
});


</script>


<style scoped>
.container,
.exercise-list-container,
.new-exercise-form {
  text-align: left; /* Alle Container linksbündig ausrichten */
}

/* Du kannst die folgenden Regeln entfernen, da sie nicht mehr benötigt werden */
.new-exercise-form input[type="text"],
.new-exercise-form input[type="number"] {
  width: 80%;
  margin-bottom: 10px;
}

.new-exercise-form label,
.new-exercise-form input {
  width: calc(50% - 10px);
  margin-bottom: 5px;
}

.new-exercise-form label {
  margin-right: 0px;
}

.profile-welcome {
  margin-top: 80px;
  text-align: left;
}

input,
button {
  margin-bottom: 10px;
}

.bg-light-gray {
  background-color: #f8f9fa;
}
</style>
