<script lang="ts">
import {defineComponent, ref} from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Navbar',
  components: { RouterLink },
  setup() {
    const navbarToggler = ref<HTMLElement | null>(null); // Referenz auf den Navbar-Toggler

    // Funktion zum Schließen des Navbar-Togglers
    const closeNavbar = () => {
      if (navbarToggler.value) {
        navbarToggler.value.click(); // Klickereignis auslösen, um den Toggler zu schließen
      }
    };

    return { navbarToggler, closeNavbar };
  }
})
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <!-- Logo in der Navbar -->
      <a class="navbar-brand" href="#">
        <img class="navbar-logo" src="@/assets/logo.png" alt="FitnessPlaner Logo" />

      </a>

      <!-- Toggler für kleine Bildschirme -->
      <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
          ref="navbarToggler"
      >
      <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar-Inhalte -->
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <!-- Links-Inhalte -->
          <router-link class="nav-link" to="/" @click="closeNavbar()">Home</router-link>
          <router-link class="nav-link" to="/about" @click="closeNavbar()">About</router-link>
          <router-link class="nav-link" to="/workoutplan" @click="closeNavbar()">WorkoutPlan</router-link>

          <!-- Flex-Grow, um Raum zu schaffen -->
          <div class="flex-spacer"></div> <!-- Füllt den Raum aus, bewegt Profile nach rechts -->

          <!-- Profile-Link rechts -->
          <router-link class="nav-link" to="/myprofile" @click="closeNavbar()">MyProfile</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-logo {
  height: 70px; /* Anpassbare Höhe für das Logo */
  margin-right: 0px; /* Platz zwischen Logo und Text */
}
</style>


<style scoped>
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

.navbar-nav {
  display: flex;
  flex-grow: 1; /* Ermöglicht das flexible Element */
}

.flex-spacer {
  flex-grow: 1; /* Füllt den Raum, sodass "Profile" nach rechts verschoben wird */
}

.navbar-logo {
  height: 70px; /* Logo-Höhe */
}
</style>
