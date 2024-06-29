<template>
  <div class="container">
    <div v-if="isAuthenticated">
      <h4 class="profile-welcome">You can do it, {{ userName }}!</h4>
      <div>
        <h6 class="add-progress" style="text-align: left;">Add your progress for today!</h6>
      </div>

      <div class="exercise-list-container">
        <div class="new-exercise-form">
          <label>Exercise name:</label>
          <input type="text" v-model="newExercise.name" placeholder="Type in exercise name">

          <label>Sets:</label>
          <input type="number" v-model="newExercise.sets" @input="updateRepetitions(newExercise.sets)" placeholder="0">

          <!-- Show only if Sets > 0 -->
          <template v-if="newExercise.sets > 0">
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
            <input type="email" v-model="email" placeholder="Your email">
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
          <button class="btn btn-primary" v-if="exercise.length > 0" @click="toggleExerciseList">
            {{ showExerciseList ? 'Hide Exercise' : 'Show Exercise' }}
          </button>
        </div>
      </div>

      <!-- Exercise list -->
      <div v-if="showExerciseList" class="mt-3">
        <h5>Exercise List:</h5>
        <ul>
          <li v-for="(ex, index) in exercise" :key="index">
            <p><strong>Name:</strong> {{ ex.name }}</p>
            <p><strong>Sets:</strong> {{ ex.sets }}</p>
            <p><strong>Repetitions:</strong> {{ ex.repetitions.join(', ') }}</p>
            <p><strong>Weight:</strong> {{ ex.weight.join(', ') }}</p>
            <button class="btn btn-sm btn-danger" @click="deleteExercise(index)">Delete</button>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <h4 class="profile-welcome">Please log in to add your workoutplan.</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuth } from '@okta/okta-vue';
import type { Exercise } from "@/model/model";

const exercise = ref<Exercise[]>([]);
const newExercise = ref<Exercise>({
  name: '',
  sets: null,
  repetitions: [],
  weight: [],
  totalWeight: 0,
  owner: ''
});
const email = ref<string>('');
const showExerciseList = ref(true);
const userName = ref('');
const isAuthenticated = ref(false);

const $auth = useAuth();

const fetchInitialExerciseData = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/workoutplan', {
      headers: {
        Authorization: 'Bearer ' + $auth.getAccessToken()
      }
    });
    if (Array.isArray(response.data) && response.data.length > 0) {
      exercise.value = response.data;
    } else {
      console.error('Expected array from backend with at least one exercise, got:', response.data);
    }
  } catch (error) {
    console.error('Failed to fetch exercise data:', error);
  }
};

onMounted(async () => {
  try {
    isAuthenticated.value = await $auth.isAuthenticated();
    if (isAuthenticated.value) {
      const userClaims = await $auth.getUser();
      if (userClaims.email) {
        email.value = userClaims.email;
        newExercise.value.owner = userClaims.email; // Set email in newExercise
      }
      if (userClaims.given_name) {
        userName.value = userClaims.given_name;
      }

      // Fetch initial exercise data if authenticated
      fetchInitialExerciseData();
    }
  } catch (error) {
    console.error('Failed to fetch user claims:', error);
  }
});

const showInputs = () => {
  // Toggle display of repetitions and weight inputs
  newExercise.value.repetitions = Array.from({ length: newExercise.value.sets }, () => 0);
  newExercise.value.weight = Array.from({ length: newExercise.value.sets }, () => 0);
};

const addToHistory = async () => {
  if (!newExercise.value.owner) {
    console.error('Owner email is required to add exercise.');
    return;
  }

  try {
    const token = await $auth.getAccessToken();
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/workoutplan', newExercise.value, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
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
    owner: email.value // Set to current email value
  };
};

const cancel = () => {
  resetForm();
};

const updateTotalWeight = () => {
  newExercise.value.totalWeight = calculateTotalWeight(newExercise.value);
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
    newExercise.value.repetitions = Array.from({ length: value }, () => 0); // Initialize with 0
    newExercise.value.weight = Array.from({ length: value }, () => 0); // Initialize with 0
  }
};

const deleteExercise = async (index: number) => {
  if (exercise.value.length > index) {
    try {
      const response = await axios.delete(import.meta.env.VITE_BACKEND_URL + '/workoutplan');
      console.log('Deleted exercise:', response);
      exercise.value.splice(index, 1);
    } catch (error) {
      console.error('Failed to delete exercise:', error);
    }
  }
};

const toggleExerciseList = () => {
  showExerciseList.value = !showExerciseList.value;
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
