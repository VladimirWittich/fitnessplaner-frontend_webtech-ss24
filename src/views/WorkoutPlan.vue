<template>
  <div class="container">
    <h4 class="profile-welcome">You can do it Vladimir!</h4>
    <div>
      <h6 class="add-progress" style="text-align: left;">Add your progress for today!</h6>
    </div>

    <div class="exercise-list-container">
      <!-- ExerciseListComponent v-model="exercise" /> -->
      <!-- Button to hide exercise, assuming you handle this separately -->
      <button class="btn btn-primary" v-if="exercise && exercise.length > 0" @click="deleteExercise(0)">Hide Exercise</button>

      <div class="new-exercise-form">
        <label>Exercise name:</label>
        <input type="text" v-model="newExercise.name" placeholder="Type in exercise name">

        <label>Sets:</label>
        <input type="number" v-model="newExercise.sets" @input="updateRepetitions(newExercise.sets)" placeholder="0">

        <!-- Show only if Sets > 0 -->
        <template v-if="displayRepetitionsInput && displayWeightInput">
          <div class="row">
            <template v-for="(repetition, index) in newExercise.repetitions" :key="index">
              <div class="col-sm-6">
                <div class="exercise-row d-flex">
                  <div class="exercise-label flex-grow-1">Repetitions {{ index + 1 }}:</div>
                  <div class="exercise-value">
                    <input type="number" v-model="newExercise.repetitions[index]" :placeholder="'0'">
                  </div>
                  <div class="exercise-label">Weight:</div>
                  <div class="exercise-value">
                    <input type="number" v-model="newExercise.weight[index]" :placeholder="'0'" @input="updateTotalWeight()">
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>

        <!-- Email input field added -->
        <div class="email-input">
          <label>Email:</label>
          <input type="email" v-model="newExercise.owner" placeholder="Your email">
        </div>

        <!-- Buttons: Add to my History and Cancel -->
        <div class="mt-3">
          <button class="btn btn-primary" @click="addToHistory">Add to my History</button>
          <button class="btn btn-danger" @click="cancel">Cancel</button>
        </div>

        <!-- Button to show inputs -->
        <button class="btn btn-primary" @click="showInputs">Add new exercise</button>
        <!-- Router link to history -->
        <router-link to="/history" class="btn btn-primary">Go to history</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import type { Exercise } from "@/model/model";
import { useAuth } from '@okta/okta-vue';
import type { UserClaims } from '@okta/okta-auth-js';

const exercise = ref<Exercise[]>([]);
const newExercise = ref<Exercise>({
  name: '',
  sets: null,
  repetitions: [],
  weight: [],
  totalWeight: 0,
  owner: ''
});
const displayRepetitionsInput = ref(false);
const displayWeightInput = ref(false);
const email = ref('');

const $auth = useAuth();
const claims = ref<{ claim: string; value: UserClaims[keyof UserClaims] }[]>([]);

onMounted(async () => {
  try {
    const userClaims = await $auth.getUser();
    if (userClaims.email) {
      email.value = userClaims.email;
      newExercise.value.owner = userClaims.email; // Set email in newExercise
    }
  } catch (error) {
    console.error('Failed to fetch user claims:', error);
  }

  // Additional code to fetch exercises, if needed
  // Fetching initial data, if needed
  // Example:

  try {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/workoutplan');
    if (Array.isArray(response.data) && response.data.length > 0) {
      const firstExercise = response.data[0];
      newExercise.value.name = firstExercise.name;
      newExercise.value.sets = firstExercise.sets;
      newExercise.value.repetitions = firstExercise.repetitions || [];
      newExercise.value.weight = firstExercise.weight || [];
      newExercise.value.owner = firstExercise.owner;
      displayRepetitionsInput.value = firstExercise.sets > 0;
      displayWeightInput.value = firstExercise.sets > 0;
    } else {
      console.error('Expected array from backend with at least one exercise, got:', response.data);
    }
  } catch (error) {
    console.error('Failed to fetch exercise data:', error);
  }
});

const showInputs = () => {
  displayRepetitionsInput.value = true;
  displayWeightInput.value = true;
};

const addToHistory = async () => {
  if (!newExercise.value.owner) {
    console.error('Owner email is required to add exercise.');
    return;
  }

  try {
    console.log('Adding exercise:', newExercise.value);
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/workoutplan', newExercise.value, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Backend response:', response);
    exercise.value.push(response.data);
    resetForm();
  } catch (error) {
    console.error('Failed to add exercise:', error);
    console.error('Error details:', error.response);
  }
};

const resetForm = () => {
  newExercise.value = {
    name: '',
    sets: null,
    repetitions: [],
    weight: [],
    totalWeight: 0,
    owner: email.value // Reset email to current user's email
  };
  displayRepetitionsInput.value = false;
  displayWeightInput.value = false;
};

const cancel = () => {
  resetForm();
};

const updateTotalWeight = () => {
  if (newExercise.value) {
    newExercise.value.totalWeight = calculateTotalWeight(newExercise.value);
  }
};

const calculateTotalWeight = (exercise: Exercise) => {
  let totalWeight = 0;
  for (let i = 0; i < exercise.repetitions.length; i++) {
    totalWeight += (exercise.repetitions[i] || 0) * (exercise.weight[i] || 0);
  }
  return totalWeight;
};

const updateRepetitions = (value: number) => {
  if (value >= 0) {
    newExercise.value.repetitions = new Array(value).fill(null);
    newExercise.value.weight = new Array(value).fill(null);
  }
};
</script>

<style scoped>
.container {
  margin-top: 0px;
  margin-left: -20px;
}

.bg-light-gray {
  background-color: #f8f9fa;
}

.new-exercise-form input[type="text"],
.new-exercise-form input[type="number"],
.new-exercise-form input[type="email"] {
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
  margin-top: 30px;
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
