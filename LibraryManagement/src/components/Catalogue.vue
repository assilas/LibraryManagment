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
      <!-- Filtrage des livres (recherche + genre) -->
      <router-link 
        v-for="book in filteredBooks" 
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
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001';

export default {
  name: 'BookCatalog',
  setup() {
    const books = ref([]);
    const searchQuery = ref('');     // Stocke la recherche utilisateur
    const selectedGenre = ref('');   // Stocke le genre sélectionné

    const fetchBooks = async () => {
      try {
        const response = await axios.get('/books');
        books.value = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des livres', error);
      }
    };

    onMounted(fetchBooks);

    // Extraire les genres uniques depuis la liste des livres
    const uniqueGenres = computed(() => {
      // Crée un tableau de genres séparés par des virgules
      const genres = books.value.flatMap(book => 
        book.genre ? book.genre.split(',').map(genre => genre.trim()) : []
      );
      return [...new Set(genres)]; // Élimine les doublons
    });

    // Filtrer les livres en fonction de la recherche et du genre sélectionné
    const filteredBooks = computed(() => {
      return books.value.filter((book) => {
        const lowerCaseQuery = searchQuery.value.toLowerCase();
        const matchesSearch = 
          book.title.toLowerCase().includes(lowerCaseQuery) || 
          book.author.toLowerCase().includes(lowerCaseQuery);
        
        const matchesGenre = selectedGenre.value 
          ? book.genre.split(',').map(g => g.trim()).includes(selectedGenre.value) 
          : true; // Si aucun genre sélectionné, tous les livres passent

        return matchesSearch && matchesGenre;
      });
    });

    const formatTitle = (title) => {
      return title.toLowerCase().replace(/\s+/g, '-');
    };

    return { 
      books, 
      searchQuery, 
      selectedGenre, 
      uniqueGenres, 
      filteredBooks, 
      formatTitle 
    };
  },
};
</script>

<style scoped>
/* Style comme tu l'avais prévu */
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
  height: 340px;
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
