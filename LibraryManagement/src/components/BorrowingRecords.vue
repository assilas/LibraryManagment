<template>
  <div class="borrowing-records">
    <h1>You have a number of {{ borrowedBooks }} books borrowed</h1>
    <p>The limit of borrow is {{ borrowLimit }}</p>

    <div class="returned-books-section" v-if="pendingReturns.length > 0">
      <h2>Returned Books Pending Inspection</h2>
      <div class="book-card" v-for="book in pendingReturns" :key="book.id">
        <h3>{{ book.title }}</h3>
        <p>Author: {{ book.author }}</p>
        <p>Status: 
          <span :class="getStatusClass(book.status)">{{ book.status }}</span>
        </p>
        <div v-if="book.status === 'Pending'">
          <button @click="confirmReturn(book)">Confirm Return</button>
          <button @click="markAsDamaged(book)">Mark as Damaged</button>
        </div>
        <div v-if="book.status === 'Damaged'">
          <button @click="generateInvoice(book)">Generate Invoice</button>
        </div>
      </div>
    </div>

    <div v-else>
      <p>No books pending inspection.</p>
    </div>
  </div>
</template>

<script>
import jsPDF from "jspdf";

export default {
  data() {
    return {
      borrowedBooks: 0, // Replace with real data
      borrowLimit: 10,
      pendingReturns: [
        { id: 1, title: "Book 1", author: "Author 1", status: "Pending" },
        { id: 2, title: "Book 2", author: "Author 2", status: "Pending" },
      ],
    };
  },
  methods: {
    confirmReturn(book) {
      book.status = "Confirmed";
    },
    markAsDamaged(book) {
      book.status = "Damaged";
    },
    getStatusClass(status) {
      return {
        Pending: "status-pending",
        Confirmed: "status-confirmed",
        Damaged: "status-damaged",
      }[status];
    },
    generateInvoice(book) {
      const doc = new jsPDF();
      doc.text("Invoice for Damaged Book", 10, 10);
      doc.text(`Title: ${book.title}`, 10, 20);
      doc.text(`Author: ${book.author}`, 10, 30);
      doc.text("Library: Your Library Name", 10, 40);
      doc.text("Amount Due: €10", 10, 50);
      doc.save(`invoice_${book.title}.pdf`);
    },
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

.returned-books-section {
  margin-top: 20px;
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

.status-pending {
  color: orange;
}

.status-confirmed {
  color: green;
}

.status-damaged {
  color: red;
}

button {
  margin: 5px;
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
</style>
