<template>
  <div class="exercise-list-container">
    <div v-if="modelValue && modelValue.length > 0" class="container bg-light-gray p-4">
      <div class="exercise-item" v-for="(exercise, index) in modelValue" :key="index">
        <div class="exercise-row">
          <div class="exercise-label">Exercise name:</div>
          <div class="exercise-value">{{ exercise.name }}</div>
        </div>

        <div class="exercise-row">
          <div class="exercise-label exercise-label-sets">Sets:</div>
          <div class="exercise-value">
            <input type="number" v-model="exercise.sets" @change="onSetsChange(index, exercise.sets)">
          </div>
        </div>

        <template v-if="exercise.sets && exercise.repetitions">
          <template v-for="(repetition, repetitionIndex) in exercise.repetitions" :key="repetitionIndex">
            <div class="exercise-row">
              <div class="exercise-label">Repetitions {{ repetitionIndex + 1 }}:</div>
              <div class="exercise-value">
                <input type="number" v-model="exercise.repetitions[repetitionIndex]" @input="updateTotalWeight()">
              </div>
              <div class="exercise-label">Weight:</div>
              <div class="exercise-value">
                <input type="number" v-model="exercise.weight[repetitionIndex]" @input="updateTotalWeight()">
              </div>
            </div>
          </template>
        </template>

        <div class="exercise-row">
          <div class="exercise-label">Total weight:</div>
          <div class="exercise-value">{{ calculateTotalWeight(exercise) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Exercise } from "@/model/model";

const props = defineProps<{
  modelValue: Exercise[]
}>();

const generateRepetitionsArray = (sets: number) => {
  return new Array(sets).fill(0);
}

const onSetsChange = (index: number, newSets: number) => {
  if (props.modelValue) {
    props.modelValue[index].repetitions = generateRepetitionsArray(newSets);
  }
}

const updateTotalWeight = () => {
  if (props.modelValue) {
    props.modelValue.forEach((exercise) => {
      exercise.totalWeight = calculateTotalWeight(exercise);
    });
  }
};

const calculateTotalWeight = (exercise: Exercise) => {
  let totalWeight = 0;
  for (let i = 0; i < exercise.repetitions.length; i++) {
    totalWeight += (exercise.repetitions[i] || 0) * (exercise.weight[i] || 0);
  }
  return totalWeight;
};
</script>

<style scoped>
.exercise-list-container {
  margin-top: 20px;
}

.bg-light-gray {
  background-color: #f8f9fa;
}

.exercise-item {
  margin-bottom: 10px;
}

.exercise-value input[type="number"] {
  width: 80%;
  margin-bottom: 10px;
}

.exercise-row {
  display: flex;
  margin-bottom: 5px;
}

.exercise-value {
  flex: 1;
}

.exercise-label {
  min-width: 120px;
}

@media (max-width: 767px) {
  .exercise-label {
    min-width: auto;
  }
  .exercise-value input[type="number"] {
    width: 100%;
  }
}
</style>
