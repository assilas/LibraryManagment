<template>
  <div class="catalog">
    <h1>Catalogue de Livres</h1>
    <div class="book-grid">
      <div class="book-card" v-for="book in books" :key="book.id">
        <!-- Vérifie si la couverture est définie, sinon utiliser une image par défaut -->
        <img :src="book.cover || 'https://via.placeholder.com/150x220?text=Pas+de+couverture'" :alt="`Couverture de ${book.title}`" />
        <div class="book-info">
          <!-- Vérifie si le titre et l'auteur sont définis -->
          <h2>{{ book.title || 'Titre non disponible' }}</h2>
          <p>{{ book.author || 'Auteur inconnu' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Configure axios pour utiliser l'URL de base de ton serveur backend
axios.defaults.baseURL = 'http://localhost:3001'; // Assure-toi que c'est l'URL correcte

export default {
  name: 'BookCatalog',
  setup() {
    const books = ref([]);

    const fetchBooks = async () => {
      try {
        const response = await axios.get('/books');
        console.log(response.data); // Vérifie les livres dans la console
        books.value = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des livres', error);
      }
    };

    onMounted(fetchBooks);

    return { books };
  }
};

</script>

<style scoped>
/* Style comme tu l'avais prévu */
.catalog {
  padding: 20px;
  text-align: center;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.book-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  transition: transform 0.2s;
}

.book-card:hover {
  transform: scale(1.05);
}

.book-card img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.book-info {
  margin-top: 10px;
}

.book-info h2 {
  font-size: 1.1em;
  margin: 0;
}

.book-info p {
  color: #555;
  margin: 5px 0 0 0;
  font-size: 0.9em;
}
</style>
