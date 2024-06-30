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

          <div class="mt-3">
            <button class="btn btn-primary" @click="addToHistory">Add exercise</button>
            <button class="btn btn-danger" @click="cancel">Cancel</button>
          </div>


          <router-link to="/history" class="btn btn-primary">Go to overview</router-link>
          <button class="btn btn-primary" v-if="exercise.length > 0" @click="clearExerciseList">
            Clear exercise list
          </button>
        </div>
      </div>

      <div v-if="exercise.length > 0" class="mt-3">
        <h5 class="exerciselist">Exercise list:</h5>
        <ul>
          <li v-for="(ex, index) in exercise" :key="index">
            <p><strong>Name:</strong> {{ ex.name }}</p>
            <p><strong>Sets:</strong> {{ ex.sets }}</p>
            <p><strong>Repetitions:</strong> {{ ex.repetitions.join(', ') }}</p>
            <p><strong>Weight:</strong> {{ ex.weight.join(', ') }}</p>
            <p><strong>Total Weight:</strong> {{ ex.totalWeight > 0 ? ex.totalWeight.toLocaleString('de-DE', { minimumFractionDigits: 2 }) : '-' }}<light> kg</light> </p>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <h4 class="greeting">Please log in to access the service.</h4>
      <button class="btn btn-primary" @click="loginRedirect">Login</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuth } from '@okta/okta-vue';
import type { Exercise } from "@/model/model";
import {useRouter} from "vue-router";

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
const userName = ref('');
const isAuthenticated = ref(false);
const router = useRouter();


const $auth = useAuth();

const loginRedirect = () => {
  router.push('/login');
};

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
        newExercise.value.owner = userClaims.email;
      }
      if (userClaims.given_name) {
        userName.value = userClaims.given_name;
      }

      fetchInitialExerciseData();
    }
  } catch (error) {
    console.error('Failed to fetch user claims:', error);
  }
});

const showInputs = () => {
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
    owner: email.value
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
    newExercise.value.repetitions = Array.from({ length: value }, () => 0);
    newExercise.value.weight = Array.from({ length: value }, () => 0);
  }
};

const deleteExercise = async (id: number, index: number) => {
  if (exercise.value.length > index) {
    try {
      const token = await $auth.getAccessToken();
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/workoutplan/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Deleted exercise:', response);

      exercise.value.splice(index, 1);
    } catch (error) {
      console.error('Failed to delete exercise:', error);
      console.error('Error details:', error.response || error.message || error);
    }
  }
};

const clearExerciseList = () => {
  exercise.value = [];
};
</script>


<style scoped>
.container {
  margin-top: 0px;
  margin-left: -20px;
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
  margin-left: -5px;
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

.greeting {
    margin-top: 40px;
    margin-left: -3px;
  }

.btn-primary {
    margin-top: 0px;
    margin-left: -10px;
}

.exerciselist {
  margin-top: 0px;
  margin-left: 0px;
}

.btn-primary {
  margin-top: 0px;
  margin-left: -5px;
}



</style>
