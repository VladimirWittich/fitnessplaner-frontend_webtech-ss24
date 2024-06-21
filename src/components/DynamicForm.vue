<template>
  <div>
    <h3>{{ title }}</h3>
    <div>
      <input v-model="nameField" placeholder="Name" type="text">
      <input v-model.number="setsField" placeholder="Sets" type="number">
      <input v-model.number="repetitionsField" placeholder="Repetitions" type="number">
      <input v-model.number="weightField" placeholder="Weight" type="number">
      <button type="button" @click="save()">Save</button>
    </div>
    <div>
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Sets</th>
          <th>Repetitions</th>
          <th>Weight</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.sets }}</td>
          <td>{{ item.repetitions }}</td>
          <td>{{ item.weight }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuth } from '@okta/okta-vue'
import type { UserClaims } from '@okta/okta-auth-js'
import type { Exercise } from "@/model/model";

const props = defineProps<{
  title: string
}>()

const items = ref<Exercise[]>([])
const nameField = ref('')
const setsField = ref<number>(0)
const repetitionsField = ref<number>(0)
const weightField = ref<number>(0)
const $auth = useAuth()
const email = ref<string>('')

async function loadExercises(owner: string = '') {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  const endpoint = `${baseUrl}/workoutplan?owner=${owner}`
  try {
    const response: AxiosResponse<Exercise[]> = await axios.get(endpoint)
    items.value = response.data
  } catch (error) {
    console.error('Error loading exercises:', error)
    alert('Failed to load exercises. Please try again later.')
  }
}

async function save() {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  const endpoint = `${baseUrl}/workoutplan`
  const data: Exercise = {
    name: nameField.value,
    ownerEmail: email.value,
    sets: setsField.value,
    repetitions: repetitionsField.value,
    weight: weightField.value
  }
  try {
    if (validateExercise()) {
      const response: AxiosResponse<Exercise> = await axios.post(endpoint, data)
      const responseData: Exercise = response.data
      console.log('Success:', responseData)
      items.value.push(responseData)
      resetForm()
    } else {
      alert('Please fill in all required fields (Name, Sets, Repetitions, Weight) with valid values.')
    }
  } catch (error) {
    console.error('Error saving exercise:', error)
    alert('Failed to save exercise. Please try again later.')
  }
}

function validateExercise(): boolean {
  return nameField.value.trim() !== '' &&
      setsField.value > 0 &&
      repetitionsField.value >= 0 &&
      weightField.value >= 0
}

function resetForm() {
  nameField.value = ''
  setsField.value = 0
  repetitionsField.value = 0
  weightField.value = 0
}

onMounted(async () => {
  try {
    const userClaims: UserClaims | undefined = await $auth.getUser()
    const owner = userClaims?.email || ''
    email.value = owner
    await loadExercises(owner)
  } catch (error) {
    console.error('Error fetching user information:', error)
    alert('Failed to fetch user information. Please refresh the page.')
  }
})

</script>

<style scoped>
h3 {
  text-align: center;
}

table {
  margin-left: auto;
  margin-right: auto;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

button {
  color: blue;
  cursor: pointer;
}

/* Deaktiviere das E-Mail-Eingabefeld */
input[type="email"] {
  pointer-events: none; /* Deaktiviert Mausereignisse */
  background-color: #f8f9fa; /* Hintergrundfarbe grau machen */
}
</style>
