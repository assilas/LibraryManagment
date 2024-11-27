<template>
  <div id="app">
    <header>
      
    </header>
    <main>
      <Auth />
    </main>
  </div>
</template>

<script>
import Auth from "./components/Auth.vue"; // Assure-toi que le chemin est correct

export default {
  name: "App",
  components: {
    Auth,
  },
};
</script>

<style scoped>
/* Global styles */
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  color: #333;
  background-color: #f4f4f9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

header {
  margin-bottom: 20px;
}

h1 {
  font-size: 1.8rem;
  color: #8a2be2; /* Couleur violette pour le style */
}
</style>
