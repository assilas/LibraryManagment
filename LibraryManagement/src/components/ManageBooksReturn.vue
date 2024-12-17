<template>
    <div class="manage-returns">
      <h1>📚Manage Book Returns</h1>
      
      <!-- Table for displaying books -->
      <table>
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Member Name</th>
            <th>Return Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in returnedBooks" :key="index">
            <td>{{ book.title }}</td>
            <td>{{ book.member }}</td>
            <td>{{ book.returnDate }}</td>
            <td>
              <button @click="markAsDamaged(book, index)" class="damaged-btn">Mark as Damaged</button>
              <button @click="confirmReturn(book, index)" class="confirm-btn">Confirm Return</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Empty state message -->
      <p v-if="returnedBooks.length === 0" class="empty-message">No returned books to manage at the moment.</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";

  export default {
    data() {
      return {
        returnedBooks: [],
      };
    },
    methods: {
          async markAsDamaged(book) {
        try {
          await axios.put(`http://localhost:3001/books/damaged/${book.id}`, {
            memberId: book.memberId,
          });

          this.$emit(
            "send-notification",
            `Book "${book.title}" marked as damaged. Notification sent to ${book.memberName}.`
          );
          this.borrowedBooks = this.borrowedBooks.filter((b) => b.id !== book.id);
        } catch (error) {
          console.error("Error marking book as damaged:", error);
        }
      },
      async confirmReturn(book, index) {
    try {
      await axios.put(`http://localhost:3001/books/return/${book.id}`);

      this.$emit(
        "send-notification",
        `Book "${book.title}" returned successfully by ${book.memberName}.`
      );
      this.borrowedBooks.splice(index, 1);
    } catch (error) {
      console.error("Error confirming book return:", error);
    }
  },
    },
  };
  </script>
  
  <style scoped>
  /* Main container */
  .manage-returns {
    padding: 20px;
    max-width: 800px;
    margin: auto;
    background: linear-gradient(135deg, #fbe8e4, #f6e6d9); /* Fond rosé */
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  /* Title */
  h1 {
    text-align: center;
    color: #d19090; /* Rose doux */
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  /* Table */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #fffaf4; /* Fond blanc cassé */
    border-radius: 10px;
    overflow: hidden;
  }
  
  th, td {
    border: 1px solid #e4cfcf; /* Bordure rose pâle */
    padding: 15px;
    text-align: center;
    font-size: 14px;
    color: #8f3e3e; /* Couleur rosée pour le texte */
  }
  
  th {
    background-color: #f6e6d9; /* Fond rosé clair */
  }
  
  td {
    background-color: #fff5f0; /* Fond blanc très clair */
  }
  
  /* Buttons */
  .damaged-btn {
    background-color: #e7938e; /* Rouge rosé pour dommage */
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .damaged-btn:hover {
    background-color: #e63e3e; /* Rouge plus foncé au survol */
  }
  
  .confirm-btn {
    background-color: #db7da1; /* Vert doux pour confirmation */
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .confirm-btn:hover {
    background-color: #fc02c2; /* Vert plus foncé au survol */
  }
  
  /* Empty message */
  .empty-message {
    text-align: center;
    margin-top: 20px;
    color: #b36a6a; /* Rose légèrement plus foncé */
    font-size: 1rem;
    font-style: italic;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    table {
      font-size: 12px;
    }
  
    th, td {
      padding: 10px;
    }
  }
</style>