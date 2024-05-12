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
      <!-- Logo in der Navbar als Router-Link zur Startseite -->
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



        </div>
      </div>
    </div>
  </nav>
</template>


<style scoped>
.navbar-brand-container {
  display: flex;
  justify-content: center; /* Zentriert den Inhalt horizontal */
  align-items: center; /* Zentriert den Inhalt vertikal */
  flex-grow: 1; /* Nimmt den verbleibenden Platz ein und zentriert das Logo */
}

.navbar-logo {
  height: 15px; /* Anpassung der Höhe des Logos */
}

.navbar-icon {
  height: 40px; /* Anpassung der Höhe des Logos */
  margin-left: 20px; /* Platz zwischen Logo und Text */
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
  margin-right: auto; /* Zentriert das Logo */
}

.navbar-toggler {
  order: -1; /* Bringt den Toggler nach ganz links */
  margin-right: 0px;
}

.navbar-nav {
  display: flex;
  flex-grow: 1; /* Ermöglicht das flexible Element */
  justify-content: flex-start; /* Inhalt links ausrichten */
}

.flex-spacer {
  flex-grow: 1; /* Füllt den Raum, sodass "Profile" nach rechts verschoben wird */
}
</style>