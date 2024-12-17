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

        <!-- Affichage des boutons uniquement pour le libraire -->
        <div v-if="isLibrarian" class="librarian-buttons">
      <button @click="openModal" class="btn">Add a Book</button>
    </div>

    <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal">
        <h2>Add a New Book</h2>
        
        <!-- Formulaire d'ajout de livre -->
        <form @submit.prevent="addNewBook">
          <label for="title">Title:</label>
          <input type="text" v-model="newBook.title" id="title" required />

          <label for="author">Author:</label>
          <input type="text" v-model="newBook.author" id="author" required />

          <label for="genre">Genre:</label>
          <input type="text" v-model="newBook.genre" id="genre" />

          <label for="publishedYear">Published Year:</label>
          <input type="number" v-model="newBook.publishedYear" id="publishedYear" />

          <label for="summary">Summary:</label>
          <textarea v-model="newBook.summary" id="summary" required></textarea>

          <label for="cover">Cover Image URL:</label>
          <input type="text" v-model="newBook.cover" id="cover" />

          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn btn-cancel">Cancel</button>
            <button type="submit" class="btn btn-submit">Submit</button>
          </div>
        </form>
      </div>
    </div>

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
            
          <button 
            v-if="isLibrarian" 
            @click="removeBook(book.id)" 
            class="delete-btn"
          >
          <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </router-link>

      <!-- Affichage des livres empruntés (grisés) -->
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
    const isLibrarian = ref(false);
    const isModalVisible = ref(false); // Afficher ou masquer le formulaire d'ajout de livre
    const newBook = ref({
      title: '',
      author: '',
      genre: '',
      publishedYear: null,
      summary: '',
      cover: ''
    });

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      isLibrarian.value = decoded.role === 'librarian';
    }

    const fetchBooks = async () => {
      try {
        const response = await axios.get('/books');
        books.value = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des livres', error);
      }
    };

    onMounted(fetchBooks);

    const openModal = () => {
      isModalVisible.value = true;
    };

    // Fonction pour fermer le modal
    const closeModal = () => {
      isModalVisible.value = false;
      // Réinitialiser le formulaire
      newBook.value = {
        title: '',
        author: '',
        genre: '',
        publishedYear: '',
        summary: '',
        cover: '',
      };
    };

    const uniqueGenres = computed(() => {
      const genres = books.value.flatMap(book => 
        book.genre ? book.genre.split(',').map(genre => genre.trim()) : []
      );
      return [...new Set(genres)];
    });

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

    const availableBooks = computed(() => {
      return filteredBooks.value.filter(book => book.isAvailable);
    });

    const borrowedBooks = computed(() => {
      return filteredBooks.value.filter(book => !book.isAvailable);
    });

    const formatTitle = (title) => {
      return title.toLowerCase().replace(/\s+/g, '-');
    };

    // Fonction pour ajouter un livre
    const addNewBook = async () => {
      try {
        await axios.post('/books', newBook.value);
        alert('Livre ajouté avec succès!');
        fetchBooks(); // Mettre à jour la liste des livres
        closeModal(); // Fermer le modal
      } catch (error) {
        console.error('Erreur lors de l\'ajout du livre', error);
        alert('Erreur lors de l\'ajout du livre.');
      }
    };

    // Fonction pour supprimer un livre
    const removeBook = async (bookId) => {
      if (confirm("Are you sure you want to delete this book?")) {
        try {
          await axios.delete(`/books/${bookId}`);
          alert("Book removed successfully!");
          fetchBooks(); // Met à jour la liste des livres
        } catch (error) {
          console.error("Error removing book:", error);
          alert("Failed to remove the book.");
        }
      }
    };

    return { 
      books, 
      searchQuery, 
      selectedGenre, 
      uniqueGenres, 
      availableBooks, 
      borrowedBooks, 
      formatTitle, 
      isLibrarian, 
      isModalVisible,
      removeBook, 
      newBook,
      openModal,
      closeModal,
      addNewBook, 
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
  margin-bottom: 15px;
}

/* Overlay flouté */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1); /* Léger assombrissement */
  backdrop-filter: blur(6px); /* Effet de flou doux */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Conteneur du modal */
.modal {
  background-color: #fff8f4; /* Beige pastel */
  padding: 25px 30px;
  width: 500px;
  max-width: 90%;
  border: 1px solid #e4cfcf; /* Rose clair */
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
}

/* Animation d'apparition */
@keyframes fadeIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Titre */
.modal h2 {
  font-family: "Georgia", serif;
  font-size: 1.8em;
  color: #b46464; /* Rose foncé */
  font-weight: bold;
  margin-bottom: 15px;
}

/* Espacement des labels */
.modal label {
  display: block;
  text-align: left;
  margin-bottom: 5px;
  font-size: 1em;
  color: #7d4c4c; /* Brun pastel doux */
  font-weight: 600;
}

/* Champs du formulaire */
.modal input, 
.modal textarea {
  width: calc(100% - 20px);
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #e4cfcf;
  border-radius: 8px;
  background-color: #fffaf6; /* Blanc cassé pastel */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  color: #333;
  transition: all 0.3s ease;
  display: block; /* Assure qu'ils prennent la largeur entière */
  box-sizing: border-box;
}

.modal input:focus, 
.modal textarea:focus {
  outline: none;
  border-color: #b46464; /* Rose foncé */
  box-shadow: 0 0 5px rgba(180, 100, 100, 0.3);
}

/* Boutons */
.modal-footer {
  display: flex;
  justify-content: center; /* Centre les boutons horizontalement */
  gap: 15px; /* Ajoute un espacement entre les boutons */
  margin-top: 20px; /* Espacement par rapport aux champs */
}

.librarian-buttons {
  display: flex;
  gap: 15px; /* Espacement horizontal entre les boutons */
  justify-content: center; /* Centre les boutons horizontalement */
  margin-bottom: 20px; /* Espacement en dessous des boutons */
}

.btn {
  padding: 10px 15px;
  font-size: 1em;
  border: none;
  border-radius: 8px;
  background-color: #b46464be; /* Rose foncé */
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cancel {
  background-color: #e4cfcf; /* Rose clair */
  color: #7d4c4c; /* Brun pastel */
}

.btn-cancel:hover {
  background-color: #d3b8b8;
}

.btn-submit {
  background-color: #b46464; /* Rose foncé */
  color: #fff;
}

.btn-submit:hover {
  background-color: #9a4e4e;
  transform: scale(1.05);
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.book-card {
  position: relative; /* Permet de positionner des enfants en absolu */
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

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  font-size: 1.5em; /* Taille de l'icône */
  cursor: pointer;
  color: #b46464; /* Rose foncé pour l'icône */
  transition: color 0.3s ease, transform 0.2s ease;
}

.delete-btn:hover {
  color: #9a4e4e; /* Couleur plus sombre au hover */
  transform: scale(1.2); /* Effet de zoom léger */
}

</style>