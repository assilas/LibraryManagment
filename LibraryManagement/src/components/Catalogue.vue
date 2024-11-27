<template>
    <div class="catalog">
      <h1>Catalogue de Livres</h1>
      <div class="book-grid">
        <div class="book-card" v-for="book in books" :key="book.id">
          <img :src="book.cover" :alt="`Couverture de ${book.title}`" />
          <div class="book-info">
            <h2>{{ book.title }}</h2>
            <p>{{ book.author }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'BookCatalog',
    setup() {
      const books = ref([
        {
          id: 1,
          title: 'Le Petit Prince',
          author: 'Antoine de Saint-Exupéry',
          cover: 'https://via.placeholder.com/150x220?text=Le+Petit+Prince',
        },
        {
          id: 2,
          title: '1984',
          author: 'George Orwell',
          cover: 'https://via.placeholder.com/150x220?text=1984',
        },
        {
          id: 3,
          title: 'Les Misérables',
          author: 'Victor Hugo',
          cover: 'https://via.placeholder.com/150x220?text=Les+Misérables',
        },
        {
          id: 4,
          title: 'L’Étranger',
          author: 'Albert Camus',
          cover: 'https://via.placeholder.com/150x220?text=L’Étranger',
        },
        // Ajoutez autant de livres que vous le souhaitez
      ]);
  
      return {
        books,
      };
    },
  };
  </script>
  
  <style scoped>
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
  }
  
  .book-card:hover {
    transform: scale(1.05);
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
  