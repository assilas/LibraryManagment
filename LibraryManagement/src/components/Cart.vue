<template>
    <div class="cart-container">
      <h1>Your Cart</h1>
  
      <!-- Affichage des livres du panier -->
      <div v-if="cart.length > 0" class="cart-list">
        <div v-for="(book, index) in cart" :key="index" class="cart-item">
          <!-- Checkbox pour sélectionner le livre -->
          <input
            type="checkbox"
            :value="book"
            v-model="selectedBooks"
            class="select-checkbox"
          />
  
          <router-link
            :to="`/book/${formatTitle(book.title)}`"
            class="book-details-link"
          >
            <div class="book-details">
              <img
                :src="book.cover || 'https://via.placeholder.com/150x220?text=No+Image'"
                alt="Book Cover"
                class="book-cover"
              />
              <div class="book-info">
                <h3>{{ book.title }}</h3>
                <p><strong>Author:</strong> {{ book.author }}</p>
              </div>
            </div>
          </router-link>
          <button @click="removeFromCart(index)" class="remove-button">
            Remove
          </button>
        </div>
  
        <!-- Bouton pour confirmer l'emprunt -->
        <button
          @click="confirmBorrow"
          :disabled="selectedBooks.length === 0"
          class="confirm-borrow-button"
        >
          Confirm Borrow
        </button>
      </div>
  
      <!-- Message si le panier est vide -->
      <div v-else class="empty-cart">
        <p>Your cart is empty.</p>
        <router-link to="/Catalog">Go to Catalog</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        cart: [], // Liste des livres dans le panier
        selectedBooks: [], // Liste des livres sélectionnés
      };
    },
    methods: {
      // Récupère les livres depuis le localStorage
      loadCart() {
        const storedCart = localStorage.getItem("shoppingCart");
        this.cart = storedCart ? JSON.parse(storedCart) : [];
        this.emitCartUpdated(); // Émet un événement pour mettre à jour la nav
      },

      // Supprime un livre spécifique du panier
      removeFromCart(index) {
        this.cart.splice(index, 1);
        localStorage.setItem("shoppingCart", JSON.stringify(this.cart));
        alert("Book removed from cart.");
        this.emitCartUpdated(); // Émet un événement pour mettre à jour la nav
      },

      // Formatte le titre pour générer un slug
      formatTitle(title) {
        return title.toLowerCase().replace(/\s+/g, "-");
      },

      // Confirme l'emprunt des livres sélectionnés
      confirmBorrow() {
        if (this.selectedBooks.length === 0) {
            alert("Please select at least one book to borrow.");
            return;
        }

        // Vérifie si l'utilisateur est connecté
        const token = localStorage.getItem("token");
        if (!token) {
            localStorage.setItem(
            "selectedBooksForBorrow",
            JSON.stringify(this.selectedBooks)
            );
            alert("You need to log in to borrow books.");
            this.$router.push("/Authentification");
            return;
        }

        // Si l'utilisateur est connecté, redirige vers la page de vérification
        localStorage.setItem(
            "selectedBooksForBorrow",
            JSON.stringify(this.selectedBooks)
        );
        this.$router.push("/VerifyInfo");
        },

      
      // Émet un événement global pour mettre à jour la nav
      emitCartUpdated() {
        const event = new Event("cart-updated");
        window.dispatchEvent(event);
      },
    },
    
    mounted() {
      // Charge les livres au montage
      this.loadCart();
  
      // Si des livres ont été sélectionnés pour emprunt avant la connexion, les restaurer
      const selectedBooksForBorrow = JSON.parse(
        localStorage.getItem("selectedBooksForBorrow")
      );
      if (selectedBooksForBorrow) {
        this.selectedBooks = selectedBooksForBorrow;
        localStorage.removeItem("selectedBooksForBorrow"); // Supprime après restauration
      }
    },
  };
  </script>

  <style scoped>
  .cart-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1.5rem;
    background-color: #fff9f9;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .cart-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fdf3f3;
    border: 1px solid #f2d9d9;
    padding: 1rem;
    border-radius: 8px;
  }
  
  .book-details {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .book-details-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1; /* Prend tout l'espace pour être cliquable */
  }
  
  .book-cover {
    width: 80px;
    height: 120px;
    object-fit: cover;
    border-radius: 5px;
  }
  
  .book-info h3 {
    margin: 0;
    color: #a74369;
  }
  
  .book-info p {
    margin: 0.3rem 0;
    color: #333;
  }
  
  .select-checkbox {
    margin-right: 15px;
    transform: scale(1.2); /* Agrandit légèrement la case à cocher */
    cursor: pointer;
  }
  
  .remove-button {
    background-color: rgba(193, 118, 128, 0.9);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .remove-button:hover {
    background-color: rgb(193, 118, 128);
  }
  
  .confirm-borrow-button {
    background-color: #61c48a;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 5px;
    margin-top: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .confirm-borrow-button:hover {
    background-color: #4aa570;
  }
  
  .confirm-borrow-button:disabled {
    background-color: #7f8c8d78;
    cursor: not-allowed;
  }
  
  .empty-cart p {
    font-size: 1.2rem;
    color: #555;
  }
  
  .empty-cart a {
    color: #a74369;
    text-decoration: underline;
    font-weight: bold;
    margin-top: 1rem;
    display: inline-block;
  }
  </style>