<template>
  <div class="book-details-container" v-if="book">
    <!-- Main Section: Book Details -->
    <div class="book-cover">
      <img :src="book.cover || 'https://via.placeholder.com/150x220?text=No+Image'" :alt="`Cover of ${book.title}`" />
    </div>
    <div class="book-info">
      <h1 class="book-title">{{ book.title }}</h1>
      <p class="book-author"><strong>Author:</strong> {{ book.author }}</p>
      <p class="book-genre"><strong>Genre:</strong> {{ book.genre }}</p>
      <p class="book-summary"><strong>Summary:</strong> {{ book.summary }}</p>
    </div>
  </div>

  <!-- "By the Same Author" Section -->
  <div v-if="sameAuthorBooks.length > 0" class="related-section">
    <h2>By the Same Author</h2>
    <div class="carousel-container">
      <!-- Flèche gauche -->
      <button
        class="nav-button left"
        @click="currentIndexByAuthor--"
        v-if="currentIndexByAuthor > 0"
      >
        &#9664;
      </button>

      <!-- Affichage des livres -->
      <div class="book-grid">
        <router-link
          v-for="(book, index) in sameAuthorBooks.slice(currentIndexByAuthor, currentIndexByAuthor + maxVisible)"
          :key="index"
          :to="`/book/${formatTitle(book.title)}`"
          class="book-card-link"
        >
          <div class="book-card">
            <img :src="book.cover || 'https://via.placeholder.com/150x220?text=No+Image'" :alt="`Cover of ${book.title}`" />
            <div class="book-info">
              <h2>{{ book.title }}</h2>
              <p class="p-author">{{ book.author }}</p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Flèche droite -->
      <button
        class="nav-button right"
        @click="currentIndexByAuthor++"
        v-if="currentIndexByAuthor + maxVisible < sameAuthorBooks.length"
      >
        &#9654;
      </button>
    </div>
  </div>

  <!-- "You May Also Like" Section -->
  <div v-if="recommendedBooks.length > 0" class="related-section">
    <h2>You May Also Like</h2>
    <div class="carousel-container">
      <!-- Flèche gauche -->
      <button
        class="nav-button left"
        @click="currentIndexRecommended--"
        v-if="currentIndexRecommended > 0"
      >
        &#9664;
      </button>

      <!-- Affichage des livres -->
      <div class="book-grid">
        <router-link
          v-for="(book, index) in recommendedBooks.slice(currentIndexRecommended, currentIndexRecommended + maxVisible)"
          :key="index"
          :to="`/book/${formatTitle(book.title)}`"
          class="book-card-link"
        >
          <div class="book-card">
            <img :src="book.cover || 'https://via.placeholder.com/150x220?text=No+Image'" :alt="`Cover of ${book.title}`" />
            <div class="book-info">
              <h2>{{ book.title }}</h2>
              <p class="p-author">{{ book.author }}</p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Flèche droite -->
      <button
        class="nav-button right"
        @click="currentIndexRecommended++"
        v-if="currentIndexRecommended + maxVisible < recommendedBooks.length"
      >
        &#9654;
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

export default {
  name: "BookDetails",
  props: ["title"],
  setup(props) {
    const book = ref(null);
    const sameAuthorBooks = ref([]);
    const recommendedBooks = ref([]);
    const currentIndexByAuthor = ref(0);
    const currentIndexRecommended = ref(0);
    const maxVisible = 4;

    // Fonction pour récupérer les détails du livre
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`/books/${props.title}`);
        book.value = response.data;

        const booksResponse = await axios.get("/books");
        const allBooks = booksResponse.data;

        // "By the Same Author" : max 7 livres
        sameAuthorBooks.value = allBooks
          .filter((b) => b.author === book.value.author && b.title !== book.value.title)
          .slice(0, 7);

        // "You May Also Like" : recommandations aléatoires sur plusieurs genres
        const bookGenres = book.value.genre.split(",").map((g) => g.trim().toLowerCase());
        const filteredBooks = allBooks.filter(
          (b) =>
            b.title !== book.value.title &&
            b.author !== book.value.author &&
            b.genre.split(",").some((g) => bookGenres.includes(g.trim().toLowerCase()))
        );

        recommendedBooks.value = getRandomBooks(filteredBooks, 7);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    // Fonction pour sélectionner des livres aléatoires
    const getRandomBooks = (books, count) => {
      const shuffled = books.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const formatTitle = (title) => title.toLowerCase().replace(/\s+/g, "-");

    // Surveiller les changements de titre dans l'URL
    watch(() => props.title, fetchBookDetails);

    // Appel initial
    onMounted(fetchBookDetails);

    return {
      book,
      sameAuthorBooks,
      recommendedBooks,
      currentIndexByAuthor,
      currentIndexRecommended,
      maxVisible,
      formatTitle,
    };
  },
};
</script>




<style scoped>
/* Main Container */
.book-details-container {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff9f9;
  border-radius: 12px;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 900px;
}

.book-cover img {
  width: 240px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  object-fit: cover;
}

.book-info {
  flex: 1;
}

.book-title {
  font-size: 2.2rem;
  color: rgb(193, 118, 128);
  margin-bottom: 1rem;
}

.book-author,
.book-genre,
.book-summary {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.add-to-cart button {
  color: white;
  background-color: rgba(193, 118, 128, 0.9);
  border: 1px solid rgb(193, 118, 128);
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s ease;
}

.add-to-cart button:hover {
  background-color: rgb(193, 118, 128);
  transform: scale(1.05);
}

/* Related Sections */
.related-section {
  margin: 3rem auto;
  max-width: 900px;
}

.related-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: rgb(193, 118, 128);
  text-align: center;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 20px;
  margin-top: 20px;
  overflow: hidden;
  padding : 0 40px;
}

.book-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  height: 340px;
  transition: transform 0.2s;
  cursor: pointer;
}

.book-card:hover {
  transform: scale(1.05);
}

.book-card-link {
  text-decoration: none;
  color: inherit;
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

.p-author{
  text-align: center;
}

.carousel-container {
  position: relative;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 10;
}

.nav-button.left {
  left: -20px; /* Déplace la flèche gauche à l'extérieur */
}

.nav-button.right {
  right: -20px; /* Déplace la flèche droite à l'extérieur */
}

.nav-button:hover {
  background-color: rgb(193, 118, 128);
  color: white;
  transform: translateY(-50%) scale(1.1);
}
</style>
