<template>
  <div class="container">
    <h4 class="greeting">Welcome to your profile, Vladimir!</h4>
  </div>

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
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

const height = ref<number>(0);
const weight = ref<number>(0);
const gender = ref<string>('male');
const bmi = ref<number>(0);
const bmiCategory = ref<string>('');

// Methode zum Abrufen der Personendaten vom Backend
const fetchPersonData = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/myprofile');
    if (Array.isArray(response.data) && response.data.length > 0) {
      const personData = response.data[0];
      height.value = personData.height;
      weight.value = personData.weight;
      gender.value = personData.gender;
      calculateBMI(); // BMI neu berechnen basierend auf den erhaltenen Profildaten
    } else {
      console.error('Expected array from backend with at least one user profile, got:', response.data);
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

// Berechnung des BMI und der BMI-Kategorie
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

// Abrufen der Personendaten bei der Komponenten-Montage
onMounted(() => {
  fetchPersonData();
});

// Überwachung von Änderungen an Größe, Gewicht und Geschlecht
watch([height, weight, gender], () => {
  calculateBMI();
});
</script>

<style scoped>
.container {
  margin-top: 20px;
  text-align: left;
}
.greeting {
  margin-top: 80px;
  text-align: left;
}

.input-row {
  margin-bottom: 10px;
}

.input-row label {
  display: inline-block;
  width: 120px;
}
</style>
