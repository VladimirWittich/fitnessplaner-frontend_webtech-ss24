<script setup lang="ts">


import { type Ref, ref } from 'vue';
import type {Excercise} from "@/model/model";
import ExcerciseListComponent from "@/components/ExcerciseListComponent.vue";

const excercise = ref([
  { name: 'Bench Press', sets: 5 },
  { name: 'Bench Press Incline', sets: 4},
  { name: 'Shoulder Press', sets: 0 },
]);

let newExcercise: Ref<Excercise> = ref({ name: 'type in excercise', sets: 0 });


function addNewExcercise() {
  excercise.value.push(newExcercise.value);
}
</script>

<template>
  <!-- Vertikale Anordnung -->
  <div>
    <h1 class="profile-welcome">Welcome to your workout plan Vladimir</h1>
  </div>
  <!-- Vertikale Anordnung der Inhalte -->
  <div class="exercise-list-container">
    <ExcerciseListComponent v-model="excercise"></ExcerciseListComponent>

    <div class="new-exercise-form">
      <label>Exercise Name</label>
      <input type="text" v-model="newExcercise.name">

      <label>Exercise Sets</label>
      <input type="number" v-model="newExcercise.sets">

      <button @click="addNewExcercise()">Add Exercise</button>

    </div>
  </div>
</template>

<style scoped>
@media (max-width: 767px) {
  .exercise-list-container {
    margin-top: 80px;
  }

  .new-exercise-form {
    margin-top: 80px;
  }

  .profile-welcome {
    margin-top: 80px;
  }
}

input, button {
  margin-bottom: 10px; /* Platz zwischen Elementen */
}
</style>
