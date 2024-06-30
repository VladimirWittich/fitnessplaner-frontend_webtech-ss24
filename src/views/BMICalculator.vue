<template>
  <div v-if="isAuthenticated" class="container">
    <h4 class="greeting">Calculate your BMI </h4>
    <h8 class="greeting">What is your target, {{ userName }}?</h8>


    <div class="myprofile">
      <div class="input-row">
        <label for="height">Height (cm):</label>
        <input type="number" id="height" v-model="height" @input="calculateBMI">
      </div>

      <div class="input-row">
        <label for="weight">Weight (kg):</label>
        <input type="number" id="weight" v-model="weight" @input="calculateBMI">
      </div>

      <div class="input-row">
        <label for="gender">Gender:</label>
        <select id="gender" v-model="gender" @change="calculateBMI">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div class="input-row">
        <label>BMI:</label>
        <div>{{ bmi }}</div>
        <div v-if="bmiCategory">BMI Category: {{ bmiCategory }}</div>
      </div>
    </div>
  </div>

  <div v-else>
    <h4 class="greeting">Please log in to access the service.</h4>
    <button class="btn btn-primary" @click="loginRedirect">Login</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useAuth } from '@okta/okta-vue';
import {useRouter} from "vue-router";

const height = ref<number>(0);
const weight = ref<number>(0);
const gender = ref<string>('male');
const bmi = ref<number>(0);
const bmiCategory = ref<string>('');
const isAuthenticated = ref(false);
const $auth = useAuth();
let userName = ref('');
const router = useRouter();


const loginRedirect = () => {
  router.push('/login');
};

const fetchPersonData = async () => {
  try {
    const token = await $auth.getAccessToken();
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/bmicalculator', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data && response.data.length > 0) { // sicherstellen, dass Daten vorhanden sind
      const personData = response.data[0]; // Da das Backend ein Array von Objekten zurückgibt, auf das erste Objekt zugreifen
      console.log('Received person data:', personData);
      if (personData.height) height.value = personData.height;
      if (personData.weight) weight.value = personData.weight;
      if (personData.gender) gender.value = personData.gender;
      calculateBMI();
    } else {
      console.error('Empty response or invalid data format:', response.data);
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

const fetchUserName = async () => {
  try {
    const userClaims = await $auth.getUser();
    if (userClaims.given_name) {
      userName.value = userClaims.given_name;
    } else {
      userName.value = "User"; // Fallback, falls kein Vorname vorhanden ist
    }
  } catch (error) {
    console.error('Failed to fetch user name:', error);
  }
};

const calculateBMI = () => {
  if (height.value > 0 && weight.value > 0) {
    const heightInMeter = height.value / 100;
    bmi.value = Math.round(weight.value / (heightInMeter * heightInMeter));

    if (gender.value === 'male') {
      if (bmi.value < 20) {
        bmiCategory.value = 'Underweight';
      } else if (bmi.value >= 20 && bmi.value <= 24.9) {
        bmiCategory.value = 'Normal weight';
      } else if (bmi.value >= 25 && bmi.value <= 29.9) {
        bmiCategory.value = 'Overweight';
      } else if (bmi.value >= 30 && bmi.value <= 34.9) {
        bmiCategory.value = 'Obesity Class I';
      } else if (bmi.value >= 35 && bmi.value <= 39.9) {
        bmiCategory.value = 'Obesity Class II';
      } else {
        bmiCategory.value = 'Obesity Class III';
      }
    } else {
      if (bmi.value < 19) {
        bmiCategory.value = 'Underweight';
      } else if (bmi.value >= 19 && bmi.value <= 23.9) {
        bmiCategory.value = 'Normal weight';
      } else if (bmi.value >= 24 && bmi.value <= 29.9) {
        bmiCategory.value = 'Overweight';
      } else if (bmi.value >= 30 && bmi.value <= 34.9) {
        bmiCategory.value = 'Obesity Class I';
      } else if (bmi.value >= 35 && bmi.value <= 39.9) {
        bmiCategory.value = 'Obesity Class II';
      } else {
        bmiCategory.value = 'Obesity Class III';
      }
    }
  } else {
    bmi.value = 0;
    bmiCategory.value = '';
  }
};

onMounted(async () => {
  isAuthenticated.value = await $auth.isAuthenticated();
  if (isAuthenticated.value) {
    fetchPersonData();
    fetchUserName();
  }
});

watch([height, weight, gender], () => {
  calculateBMI();
});
</script>

<style scoped>
.container {
  margin-top: 20px;
  text-align: left;
}

.myprofile{
margin-top: 40px;
margin-left: -15px;
}

.greeting {
  margin-top: 40px;
  margin-left: -15px;
}

.input-row {
  margin-bottom: 10px;
}

.input-row label {
  display: inline-block;
  width: 120px;
}

.btn-primary {
  margin-top: 0px;
  margin-left: -15px;
}
</style>
