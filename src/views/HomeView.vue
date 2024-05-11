<script setup lang="ts">
const name_first = 'Vladimir';
</script>




<template>
  <div class="greeting">
    <h1> Hi, {{name_first}}! </h1>
  </div>
</template>

<style scoped>
@media (max-width: 767px) {
  .greeting {
    margin-top: 80px;
  }}

</style>
