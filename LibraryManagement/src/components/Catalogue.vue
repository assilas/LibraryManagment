<template>
  <div class="catalog">
    <h1>Book Store</h1>
    
    <!-- Barre de recherche -->
    <input 
      type="text" 
      v-model="searchQuery" 
      placeholder="Search by title or author..." 
      class="search-bar"
    />

    <!-- Filtre par genre -->
    <select v-model="selectedGenre" class="genre-filter">
      <option value="">All genres</option>
      <option 
        v-for="genre in uniqueGenres" 
        :key="genre" 
        :value="genre"
      >
        {{ genre }}
      </option>
    </select>

    <div class="book-grid">
      <!-- Filtrage et affichage des livres disponibles -->
      <router-link 
        v-for="book in availableBooks" 
        :key="book.id" 
        :to="`/book/${formatTitle(book.title)}`" 
        class="book-card-link"
      >
        <div class="book-card">
          <img :src="book.cover || 'https://via.placeholder.com/150x220?text=Pas+de+couverture'" 
               :alt="`Couverture de ${book.title}`" />
          <div class="book-info">
            <h2>{{ book.title }}</h2>
            <p>{{ book.author }}</p>
          </div>
        </div>
      </router-link>

      <!--
       Affichage des livres empruntés (grisés) -->
      <div 
        v-for="book in borrowedBooks" 
        :key="book.id" 
        class="book-card book-card-disabled"
      >
        <img :src="book.cover || 'https://via.placeholder.com/150x220?text=Pas+de+couverture'" 
             :alt="`Couverture de ${book.title}`" />
        <div class="book-info">
          <h2>{{ book.title }}</h2>
          <p>{{ book.author }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001';

export default {
  name: 'BookCatalog',
  setup() {
    const books = ref([]);
    const searchQuery = ref('');
    const selectedGenre = ref('');

    const fetchBooks = async () => {
      try {
        const response = await axios.get('/books');
        books.value = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des livres', error);
      }
    };

    onMounted(fetchBooks);

    // Extraire les genres uniques
    const uniqueGenres = computed(() => {
      const genres = books.value.flatMap(book => 
        book.genre ? book.genre.split(',').map(genre => genre.trim()) : []
      );
      return [...new Set(genres)];
    });

    // Livres filtrés selon la recherche et le genre
    const filteredBooks = computed(() => {
      return books.value.filter((book) => {
        const lowerCaseQuery = searchQuery.value.toLowerCase();
        const matchesSearch = 
          book.title.toLowerCase().includes(lowerCaseQuery) || 
          book.author.toLowerCase().includes(lowerCaseQuery);
        
        const matchesGenre = selectedGenre.value 
          ? book.genre.split(',').map(g => g.trim()).includes(selectedGenre.value) 
          : true;

        return matchesSearch && matchesGenre;
      });
    });

    // Livres disponibles
    const availableBooks = computed(() => {
      return filteredBooks.value.filter(book => book.isAvailable);
    });

    // Livres empruntés (non disponibles)
    const borrowedBooks = computed(() => {
      return filteredBooks.value.filter(book => !book.isAvailable);
    });

    const formatTitle = (title) => {
      return title.toLowerCase().replace(/\s+/g, '-');
    };

    return { 
      books, 
      searchQuery, 
      selectedGenre, 
      uniqueGenres, 
      availableBooks, 
      borrowedBooks, 
      formatTitle 
    };
  },
};
</script>

<style scoped>
.catalog {
  padding: 20px;
  text-align: center;
}

.search-bar, .genre-filter {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  margin: 10px auto;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: block;
}

.genre-filter {
  cursor: pointer;
  background-color: white;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.book-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  height: 330px;
  transition: transform 0.2s;
}

.book-card:hover {
  transform: scale(1.05);
}

.book-card-disabled {
  background-color: #e0e0e0; /* Grisé */
  opacity: 0.6; /* Réduit l'opacité */
  pointer-events: none; /* Désactive le clic */
  cursor: not-allowed;
}

.book-card-link {
  text-decoration: none;
  color: inherit;
}

.book-card img {
  width: 150px;
  height: 235px;
  object-fit: cover;
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
