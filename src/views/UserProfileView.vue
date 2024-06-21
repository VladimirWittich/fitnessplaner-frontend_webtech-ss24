<template>
  <div id="profile">
    <h4 class="profile-welcome">Welcome, {{ userName }}</h4>
    <p>
      Below is the information from your ID token.
    </p>
    <table>
      <thead>
      <tr>
        <th>Claim</th>
        <th>Value</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(claim, index) in claims" :key="index">
        <td>{{ claim.claim }}</td>
        <td :id="'claim-' + claim.claim">{{ claim.value }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuth } from '@okta/okta-vue';
import type { CustomUserClaim } from '@okta/okta-auth-js';

const $auth = useAuth();
const claims = ref<{ claim: string; value: CustomUserClaim | CustomUserClaim[] }[]>([]);
const userName = ref('');

onMounted(async () => {
  try {
    const userClaims = await $auth.getUser();
    for (const claim in userClaims) {
      claims.value.push({
        claim,
        value: userClaims[claim]
      });
    }
    if (userClaims.given_name) {
      userName.value = userClaims.given_name;
    }
  } catch (error) {
    console.error('Failed to fetch user claims:', error);
  }
});
</script>

<style scoped>
/* Hier können bei Bedarf Styles ergänzt werden */
</style>
