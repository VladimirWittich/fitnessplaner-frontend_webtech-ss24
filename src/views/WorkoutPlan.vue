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
          <label>Exercise Name</label>
          <input type="text" v-model="newExercise.name" placeholder="Type in exercise name">

          <label>Sets</label>
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
import { ref } from 'vue';
import type { Exercise } from "@/model/model";
import ExerciseListComponent from "@/components/ExerciseListComponent.vue";

const exercise = ref<Exercise[] | undefined>([]);

function deleteExercise(index: number) {
  if (exercise.value) {
    exercise.value.splice(index, 1);
  }
}

const newExercise: Exercise = {
  name: '',
  sets: 0,
  repetitions: [],
  weight: [],
  totalweight: 0
};

const updateRepetitions = (value: number) => {
  newExercise.repetitions = new Array(value).fill(0);
};

// Flag, um zu überprüfen, ob das Repetitions-Eingabefeld angezeigt werden soll
const displayRepetitionsInput = ref(false);

// Flag, um zu überprüfen, ob das Gewichts-Eingabefeld angezeigt werden soll
const displayWeightInput = ref(false);

const addNewExercise = () => {
  if (exercise.value) {
    exercise.value.push({ ...newExercise });
  }
  // Reset des neuen Exercise-Objekts für die nächste Eingabe
  newExercise.name = '';
  newExercise.sets = 0;
  newExercise.repetitions = [];
  newExercise.weight = [];
  newExercise.totalweight = 0;
};

const updateTotalWeight = () => {
  if (exercise.value) {
    exercise.value.forEach((exercise) => {
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
</script>

<style scoped>
.exercise-list-container {
  margin-top: 20px;
}

.new-exercise-form {
  display: flex;
  flex-wrap: wrap; /* Elemente können bei Bedarf umgebrochen werden */
  margin-top: 50px;
}

.new-exercise-form label,
.new-exercise-form input {
  width: calc(50% - 10px); /* Breite für jedes Element */
  margin-bottom: 5px; /* Abstand zwischen den Elementen */
}

.new-exercise-form label {
  margin-right: 0px; /* Abstand zwischen den Labels */
}

.profile-welcome {
  margin-top: 80px;
  text-align: left;
}

input, button {
  margin-bottom: 10px; /* Platz zwischen Elementen */
}

.bg-light-gray {
  background-color: #f8f9fa; /* Hintergrundfarbe grau */
}

</style>
