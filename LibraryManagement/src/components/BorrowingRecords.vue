<template>
  <div class="borrowing-records">
    <h1>You have {{ borrowedBooks.length }} books borrowed</h1>
    <p>The limit of borrow is {{ borrowLimit }}</p>

    <div v-if="borrowedBooks.length > 0">
      <h2>Your Borrowed Books</h2>
      <div
        class="book-card"
        v-for="book in borrowedBooks"
        :key="book.id"
      >
        <h3>{{ book.title }}</h3>
        <p>Author: {{ book.author }}</p>
        <p>Borrowed Date: {{ formatDate(book.borrowedDate) }}</p>
        <p>Return Deadline: {{ formatDate(book.returnDeadline) }}</p>
        <p>Time Left: <span :class="getTimeClass(book.daysLeft)">{{ book.daysLeft }} days</span></p>
        <button @click="returnBook(book)">Return</button>
      </div>
    </div>

    <div v-else>
      <p>You have not borrowed any books yet.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      borrowedBooks: [], // Liste des livres empruntés
      borrowLimit: 10, // Limite de livres empruntés
    };
  },
  methods: {
    async fetchBorrowedBooks() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in first.");
        this.$router.push("/Authentification");
        return;
      }

      try {
        // Étape 1 : Récupérer les infos de l'utilisateur
        const userResponse = await axios.get("http://localhost:3001/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const borrowedCount = userResponse.data.borrowedBooks || 0;

        // Étape 2 : Récupérer les livres marqués comme empruntés
        const booksResponse = await axios.get("http://localhost:3001/books");
        const allBooks = booksResponse.data;

        this.borrowedBooks = allBooks
          .filter((book) => !book.isAvailable) // Sélectionne les livres empruntés
          .slice(0, borrowedCount)
          .map((book) => {
            // Ajouter la date d'emprunt et la date limite
            const borrowedDate = new Date(book.updatedAt); // Date de dernière mise à jour
            const returnDeadline = new Date(borrowedDate);
            returnDeadline.setMonth(returnDeadline.getMonth() + 1); // Ajouter 1 mois

            // Calcul du temps restant en jours
            const today = new Date();
            const daysLeft = Math.ceil((returnDeadline - today) / (1000 * 60 * 60 * 24));

            return {
              ...book,
              borrowedDate,
              returnDeadline,
              daysLeft,
            };
          });
      } catch (error) {
        console.error("Error fetching borrowed books:", error.message);
        alert("Failed to fetch borrowed books.");
      }
    },

    async returnBook(book) {
      const token = localStorage.getItem("token");
      try {
        // Étape 1 : Mettre à jour le livre comme disponible
        await axios.put(
          `http://localhost:3001/books/${book.id}`, 
          { isAvailable: true }, // Change l'état du livre
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Étape 2 : Mettre à jour la liste des livres empruntés côté utilisateur
        this.borrowedBooks = this.borrowedBooks.filter((b) => b.id !== book.id);

        // Étape 3 : Afficher un message de confirmation
        alert(`${book.title} has been successfully returned.`);
      } catch (error) {
        console.error("Error returning the book:", error.message);
        alert("Failed to return the book. Please try again.");
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    getTimeClass(daysLeft) {
      if (daysLeft <= 5) return "time-critical";
      if (daysLeft <= 15) return "time-warning";
      return "time-safe";
    },
  },
  mounted() {
    this.fetchBorrowedBooks();
  },
};
</script>

<style scoped>
.borrowing-records {
  text-align: center;
  font-family: Arial, sans-serif;
  color: #97597f;
  background-color: #f6e4db;
  padding: 20px;
  border-radius: 10px;
  margin: 50px auto;
  width: 80%;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.book-card {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  margin: 10px auto;
  width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #97597f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #823c64;
}

.time-critical {
  color: red;
  font-weight: bold;
}

.time-warning {
  color: orange;
}

.time-safe {
  color: green;
}
</style>
