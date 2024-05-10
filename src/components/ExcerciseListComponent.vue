<script setup lang="ts">
import type {Excercise} from "@/model/model";

const model = defineModel<Excercise[]>()
</script>

<template>
  <div v-for="excercise in model" :key="excercise.name">
    <div>Excercise: {{ excercise.name }}</div>
    <div>Sets: {{ excercise.sets }}</div>
  </div>
</template>

<style scoped>

</style>