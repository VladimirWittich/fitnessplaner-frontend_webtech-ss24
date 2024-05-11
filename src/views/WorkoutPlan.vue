<script setup lang="ts">


import { type Ref, ref } from 'vue';
import type {Exercise} from "@/model/model";
import ExerciseListComponent from "@/components/ExerciseListComponent.vue";

const exercise = ref([

]);

let newExercise: Ref<Exercise> = ref({ name: 'Type in exercise name', sets: 0 , repetitions: 0});

function addNewExercise() {
  exercise.value.push(newExercise.value);
}

function deleteExercise(index: number) {
  exercise.value.splice(index, 1);
}



</script>

<template>
  <!-- Vertikale Anordnung -->
  <div>
    <h4 class="profile-welcome">You can do it Vladimir!</h4>
  </div>
  <div>
    <h6 class="add-progress" style="text-align: left;">Add your progress for today!</h6>
  </div>

  <!-- Vertikale Anordnung der Inhalte -->
  <div class="exercise-list-container">
    <ExerciseListComponent v-model="exercise"></ExerciseListComponent>
    <button v-if="exercise.length > 0" @click="deleteExercise(0)">Delete Exercise</button>

    <div class="new-exercise-form">
      <label>Exercise Name</label>
      <input type="text" v-model="newExercise.name" placeholder="Type in exercise name">

      <label>Sets</label>
      <input type="number" v-model="newExercise.sets" placeholder="0">

      <label>Repetitions</label>
      <input type="number" v-model="newExercise.repetitions" placeholder="12-10-8">

      <button @click="addNewExercise()">Add Exercise</button>

    </div>
  </div>
</template>

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
</style>
