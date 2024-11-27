<template>
    <div class="home-container">
      <div class="background-grid">
        <div class="grid-item" v-for="(image, index) in images" :key="index">
          <img :src="image" alt="Decorative book aesthetic" />
        </div>
      </div>
      <div class="content">
        <h1>Books & Noble</h1>
        <router-link to="/Catalogue.vue">Visit our books</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        images: [
          "https://i.pinimg.com/736x/27/7f/62/277f62461d6a10dd340e5f390f911f6e.jpg",
          "https://i.pinimg.com/736x/26/49/a9/2649a99c4bdf33b4b422bb3d9d7792a2.jpg",
          "https://i.pinimg.com/736x/39/60/2b/39602b544511779bd251135ea1a6d7d5.jpg",
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  /* Conteneur principal */
  .home-container {
  position: relative;
  width: 100%;
  height: 100vh; /* Fixe la hauteur à la pleine fenêtre */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* S'assure que la grille occupe tout l'espace */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Grille fluide */
  gap: 10px;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px; /* Facultatif pour un rendu esthétique */
}

  
  /* Contenu au premier plan */
  .content {
    position: relative;
    z-index: 2; /* Devant la grille */
    text-align: center;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  }
  
  .content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  a {
    color: white;
    background-color: rgba(193, 118, 128, 0.614);
    border: solid 1px rgb(193, 118, 128);
    border-radius: 12px;
    padding : 8px;
    text-decoration:none;
  }
  </style>
  