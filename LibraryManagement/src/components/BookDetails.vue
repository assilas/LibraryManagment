<template>
    <div class="book-details" v-if="book">
      <h1>{{ book.title }}</h1>
      <p><strong>Auteur:</strong> {{ book.author }}</p>
      <p><strong>Description:</strong> {{ book.summary }}</p>  <!-- Utilise 'summary' plutôt que 'description' -->
      <img :src="book.cover" :alt="`Couverture de ${book.title}`" />
      <!-- Ajouter d'autres informations ici -->
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  axios.defaults.baseURL = 'http://localhost:3001';
  
  export default {
    name: 'BookDetails',
    props: ['title'],
    setup(props) {
      const book = ref(null);
  
      const fetchBookDetails = async () => {
        try {
          const response = await axios.get(`/books/${props.title}`);
          book.value = response.data;
        } catch (error) {
          console.error('Erreur lors de la récupération du livre', error);
        }
      };
  
      onMounted(fetchBookDetails);
  
      return { book };
    },
  };
  </script>
  
  <style scoped>
  /* Style pour les détails du livre */
  .book-details {
    padding: 20px;
    text-align: center;
  }
  
  .book-details h1 {
    font-size: 2em;
  }
  
  .book-details p {
    font-size: 1.1em;
  }
  </style>
  