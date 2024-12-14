<template>
  <div class="catalog">
    <h1>Catalogue de Livres</h1>
    <div class="book-grid">
      <!-- Le router-link enveloppe toute la carte -->
      <router-link 
        v-for="book in books" 
        :key="book.id" 
        :to="`/book/${formatTitle(book.title)}`" 
        class="book-card-link"
      >
        <div class="book-card">
          <img :src="book.cover || 'https://via.placeholder.com/150x220?text=Pas+de+couverture'" :alt="`Couverture de ${book.title}`" />
          <div class="book-info">
            <h2>{{ book.title || 'Titre non disponible' }}</h2>
            <p>{{ book.author || 'Auteur inconnu' }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>


<script>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001';

export default {
  name: 'BookCatalog',
  setup() {
    const books = ref([]);

    const fetchBooks = async () => {
      try {
        const response = await axios.get('/books');
        books.value = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des livres', error);
      }
    };

    // Appel à fetchBooks lors du montage du composant
    onMounted(fetchBooks);



    const formatTitle = (title) => {
      return title.toLowerCase().replace(/\s+/g, '-'); // Remplacer les espaces par des tirets
    };

    return { books, formatTitle };
  },
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
  cursor: pointer;       /* Curseur en forme de main */
}

.book-card:hover {
  transform: scale(1.05);
}

.book-card-link {
  text-decoration: none; /* Enlève le soulignement */
  color: inherit;        /* Utilise la couleur par défaut */
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
