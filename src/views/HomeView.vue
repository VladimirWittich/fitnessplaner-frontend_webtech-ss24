<script setup lang="ts">
const name_first = 'Vladimir';
</script>




<template>
  <div class="greeting">
    <h1> Hi, {{name_first}}! </h1>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .greeting {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 200px;
  }}

</style>
