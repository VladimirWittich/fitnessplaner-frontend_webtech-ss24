<template>
  <div class="container">
    <h4 class="greeting">Welcome to your profile, {{ userName }}!</h4>
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

    <ul>
      <li v-for="statistic in dailyImprovements" :key="statistic.exerciseName">
        {{ statistic.exerciseName }}: {{ statistic.improvement > 0 ? '+' : '' }}{{ statistic.improvement }}
      </li>
    </ul>

    <div class="input-row">
      <label>BMI:</label>
      <div>{{ bmi }}</div>
      <div v-if="bmiCategory">BMI Category: {{ bmiCategory }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

const userName = ref<string>('');
const height = ref<number>(0);
const weight = ref<number>(0);
const gender = ref<string>('male');
const bmi = ref<number>(0);
const bmiCategory = ref<string>('');
const dailyImprovements = ref<{ exerciseName: string; improvement: number }[]>([]);

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

// Funktion zum Abrufen der täglichen Verbesserungen
const fetchDailyImprovements = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/myprofile/check');
    if (Array.isArray(response.data) && response.data.length > 0) {
      dailyImprovements.value = response.data;
    } else {
      console.error('Expected array from backend with at least one exercise, got:', response.data);
    }
  } catch (error) {
    console.error('Error fetching daily improvements:', error);
  }
};

// Abrufen der Benutzerprofil-Daten beim Laden der Komponente
onMounted(() => {
  axios.get(import.meta.env.VITE_BACKEND_URL + '/myprofile')
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          const userProfile = response.data[0]; // Annahme: Die Daten für das erste Benutzerprofil im Array
          userName.value = userProfile.name;
          height.value = userProfile.height;
          weight.value = userProfile.weight;
          gender.value = userProfile.gender;
          calculateBMI(); // BMI neu berechnen basierend auf den erhaltenen Profildaten
        } else {
          console.error('Expected array from backend with at least one user profile, got:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });

  fetchDailyImprovements();
});

// Überwachung von Änderungen an Größe, Gewicht und Geschlecht
watch([height, weight, gender], () => {
  calculateBMI();
});

</script>

<style scoped>

.greeting {
  margin-top: 40px;
  margin-left: -30px;
}

.input-row {
  margin-bottom: 10px;
  margin-left: -15px;

}

.input-row label {
  display: inline-block;
  width: 120px;
}
</style>