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
      <div class="add-to-cart">
        <button @click="addToCart(book)">Add to Cart</button>
      </div>
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
    const maxVisible = ref(4); // Nombre d'éléments visibles dynamiquement
    const cartKey = "shoppingCart"; // Clé pour stocker les données du panier

    // Fonction pour ajuster dynamiquement maxVisible
    const updateMaxVisible = () => {
      const containerWidth = document.querySelector(".carousel-container")?.offsetWidth || window.innerWidth;
      const bookCardWidth = 200; // Largeur approximative d'une carte (incluant les marges)
      const arrowSpace = 80; // Espace réservé pour les flèches (40px de chaque côté)
      
      // Calculer le nombre maximum de livres visibles en fonction de la largeur du conteneur
      maxVisible.value = Math.max(Math.floor((containerWidth - arrowSpace) / bookCardWidth), 1);
    };

    // Récupérer les détails du livre et suggestions
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`/books/${props.title}`);
        book.value = response.data;

        const booksResponse = await axios.get("/books");
        const allBooks = booksResponse.data;

        // "By the Same Author"
        sameAuthorBooks.value = allBooks.filter(
          (b) => b.author === book.value.author && b.title !== book.value.title
        );

        // "You May Also Like"
        const bookGenres = book.value.genre.split(",").map((g) => g.trim().toLowerCase());
        const filteredBooks = allBooks.filter(
          (b) =>
            b.title !== book.value.title &&
            b.genre.split(",").some((g) => bookGenres.includes(g.trim().toLowerCase()))
        );
        recommendedBooks.value = getRandomBooks(filteredBooks, 7);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    const getRandomBooks = (books, count) => {
      const shuffled = books.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const addToCart = (selectedBook) => {
      // Récupère le panier actuel
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const existingBook = cart.find((item) => item.title === selectedBook.title);

      if (existingBook) {
        alert("This book is already in your cart!");
      } else {
        // Ajoute le livre au panier
        cart.push(selectedBook);
        localStorage.setItem(cartKey, JSON.stringify(cart));
        alert(`${selectedBook.title} has been added to your cart!`);

        // Émet un événement pour synchroniser avec le compteur du panier
        const event = new Event("cart-updated");
        window.dispatchEvent(event);
      }
    };
    
    const formatTitle = (title) => title.toLowerCase().replace(/\s+/g, "-");

    watch(() => props.title, fetchBookDetails);

    onMounted(() => {
      fetchBookDetails();
      updateMaxVisible();
      window.addEventListener("resize", updateMaxVisible);
      window.addEventListener("resize", () => {
        const containerWidth = document.querySelector(".carousel-container")?.offsetWidth || window.innerWidth;
        const bookCardWidth = 200;
        const arrowSpace = 80;
        maxVisible.value = Math.max(Math.floor((containerWidth - arrowSpace) / bookCardWidth), 1);
      });
    });

    return {
      book,
      sameAuthorBooks,
      recommendedBooks,
      currentIndexByAuthor,
      currentIndexRecommended,
      maxVisible,
      formatTitle,
      addToCart
    };
  },
};
</script>


<style scoped>
body, html {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Empêche l'apparition des curseurs horizontaux */
}

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
  padding: 0.5rem 1rem;
  margin-top: 12px;
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
  display: flex; /* Utilise flex pour le grid horizontal */
  gap: 20px;
  padding: 0 20px;
  justify-content: center; /* Centre les éléments horizontalement */
  overflow: hidden; /* Cache les éléments qui dépassent */
}

.book-card {
  flex: 0 0 auto; /* Empêche l'étirement et conserve la taille */
  width: 170px; /* Taille fixe pour chaque carte */
  height: auto;
  text-align: center;
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
  height: 250px;
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

.p-author{
  text-align: center;
}

.carousel-container {
  position: relative; /* Position relative pour que les flèches soient ancrées à ce conteneur */
  overflow: hidden; /* Évite tout dépassement */
  padding: 0 50px; /* Ajuste l'espace pour centrer les flèches */
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
  left: 20px; /* Position relative à la gauche du conteneur */
}

.nav-button.right {
  right: 20px; /* Position relative à la droite du conteneur */
}

.nav-button:hover {
  background-color: rgb(193, 118, 128);
  color: white;
  transform: translateY(-50%) scale(1.1);
}

</style>