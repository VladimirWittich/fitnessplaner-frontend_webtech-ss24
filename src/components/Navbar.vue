<script lang="ts">
import { defineComponent, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@okta/okta-vue'

export default defineComponent({
  name: 'Navbar',
  components: { RouterLink },
  setup() {
    const auth = useAuth()
    const isAuthenticated = ref(false)

    async function logout() {
      await auth.signOut()
    }

    async function checkAuthentication() {
      isAuthenticated.value = await auth.isAuthenticated()
    }

    checkAuthentication() // Initial check

    auth.authStateManager.subscribe(checkAuthentication)

    return { isAuthenticated, logout }
  }
})
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <div class="navbar-brand-container">
        <router-link to="/" class="navbar-brand">
          <img class="navbar-logo" src="@/assets/logo.png" alt="myfitnessplaner Logo" />
        </router-link>
      </div>

      <router-link to="/workoutplan" class="navbar-brand" >
        <img class="navbar-icon" src="@/assets/icon-workoutplanner.png" alt="Workoutplanner Icon" />
      </router-link>

      <router-link to="/myprofile" class="navbar-brand" >
        <img class="navbar-icon" src="@/assets/icon-myProfile.png" alt="myProfile Icon" />
      </router-link>

      <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link class="nav-link" to="/">Home</router-link>
          <router-link class="nav-link" to="/about">About</router-link>

          <router-link v-if="!isAuthenticated" to="/login" class="nav-link">Login</router-link>
          <router-link v-if="isAuthenticated" to="/profile" class="nav-link">Profile</router-link>
          <a v-if="isAuthenticated" class="nav-link" @click="logout()">Logout</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-brand-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.navbar-logo {
  height: 15px;
}

.navbar-icon {
  height: 40px;
  margin-left: 20px;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  text-align: left;
  margin: 0;
  padding: 0;
  width: 100%;
  z-index: 1000;
}

.navbar-brand {
  margin-left: auto;
  margin-right: auto;
}

.navbar-toggler {
  order: -1;
  margin-right: 0px;
}

.navbar-nav {
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
}
</style>
