<template>
  <div class="container">
    <h4 class="profile-welcome">You can do it Vladimir!</h4>
    <div>
      <h6 class="add-progress" style="text-align: left;">Add your progress for today!</h6>
    </div>

    <div class="exercise-list-container">
      <ExerciseListComponent v-model="exercise" />
      <button class="btn btn-primary" v-if="exercise && exercise.length > 0" @click="deleteExercise(0)">Hide Exercise</button>

      <div class="new-exercise-form">
        <div class="container bg-light-gray p-4">
          <label>Exercise name:</label>
          <input type="text" v-model="newExercise.name" placeholder="Type in exercise name">

          <label>Sets:</label>
          <input type="number" v-model="newExercise.sets" @input="updateRepetitions(newExercise.sets)" placeholder="0">

          <template v-if="displayRepetitionsInput && displayWeightInput">
            <div class="row">
              <template v-for="(repetition, index) in newExercise.repetitions" :key="index">
                <div class="col-sm-6">
                  <div class="exercise-row d-flex">
                    <div class="exercise-label flex-grow-1">Repetitions {{ index + 1 }}:</div>
                    <div class="exercise-value">
                      <input type="number" v-model="newExercise.repetitions[index]" :placeholder="'0'" :value="newExercise.repetitions[index] === null ? '' : newExercise.repetitions[index]">
                    </div>
                    <div class="exercise-label">Weight:</div>
                    <div class="exercise-value">
                      <input type="number" v-model="newExercise.weight[index]" :placeholder="'0'" :value="newExercise.weight[index] === null ? '' : newExercise.weight[index]" @input="updateTotalWeight()">
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Schaltflächen Add to my History und Cancel -->
            <div class="mt-3">
              <button class="btn btn-primary" @click="addToHistory">Add to my History</button>
              <button class="btn btn-danger" @click="cancel">Cancel</button>
            </div>
          </template>
        </div>

        <button class="btn btn-primary" @click="showInputs">Add new exercise</button>
        <router-link to="/history" class="btn btn-primary">Go to history</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';
import type { Exercise } from "@/model/model";
import ExerciseListComponent from "@/components/ExerciseListComponent.vue";

// Refs für Übungen und neue Übung erstellen
const exercise = ref<Exercise[]>([]);
const newExercise = ref<Exercise>({
  name: '',
  sets: null,
  repetitions: [],
  weight: [],
  totalWeight: 0
});

// Variable zur Anzeige der Eingabefelder und Buttons initialisieren
const displayRepetitionsInput = ref(false);
const displayWeightInput = ref(false);

// Funktion zum Löschen einer Übung
function deleteExercise(index: number) {
  if (exercise.value) {
    exercise.value.splice(index, 1);
  }
}

// Funktion zum Aktualisieren der Anzahl der Wiederholungen
const updateRepetitions = (value: number) => {
  if (value >= 0) {
    newExercise.value.repetitions = new Array(value).fill(null);
    newExercise.value.weight = new Array(value).fill(null);
  }
};

// Überwachung der Sets-Änderung, um Eingabefelder anzuzeigen/verstecken
watch(() => newExercise.value.sets, (newValue) => {
  displayRepetitionsInput.value = newValue > 0;
  displayWeightInput.value = newValue > 0;
});

// Funktion zum Anzeigen der Eingabefelder und Buttons
const showInputs = () => {
  displayRepetitionsInput.value = true;
  displayWeightInput.value = true;
};

// Funktion zum Hinzufügen der Übung zum Verlauf
const addToHistory = async () => {
  if (newExercise.value.name && newExercise.value.sets > 0 &&
      newExercise.value.repetitions.every(rep => rep > 0) &&
      newExercise.value.weight.every(w => w > 0)) {
    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/workoutplan', newExercise.value, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      exercise.value.push(response.data);
      resetForm(); // Formular zurücksetzen, nachdem die Übung hinzugefügt wurde
    } catch (error) {
      console.error('Failed to add exercise:', error);
    }
  } else {
    alert('Please fill in all required fields (name, sets, repetitions, weight) before adding the exercise to history.');
  }
};

// Funktion zum Zurücksetzen des Formulars
const resetForm = () => {
  newExercise.value = {
    name: '',
    sets: null,
    repetitions: [],
    weight: [],
    totalWeight: 0
  };
  displayRepetitionsInput.value = false;
  displayWeightInput.value = false;
};

// Funktion zum Abbrechen der Eingabe
const cancel = () => {
  resetForm();
};

// Funktion zum Aktualisieren des Gesamtgewichts
const updateTotalWeight = () => {
  if (newExercise.value) {
    newExercise.value.totalWeight = calculateTotalWeight(newExercise.value);
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

</script>

<style scoped>
.container {
  margin-top: 20px;
}

.bg-light-gray {
  background-color: #f8f9fa;
}

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
}

input,
button {
  margin-bottom: 0px;
}

.exercise-label {
  flex-grow: 1;
}

.exercise-value {
  width: 55px;
}

.exercise-value input {
  margin-left: 0px;
}
</style>
