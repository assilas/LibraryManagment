<template>
  <div class="borrowing-records">
    <h1>You have a number of {{ borrowedBooks }} books borrowed</h1>
    <p>The limit of borrow is {{ borrowLimit }}</p>
  </div>
  </template>
  
  <script>
export default {
  data() {
    return {
      borrowedBooks: 0, // Exemple, à remplacer par une donnée réelle
      borrowLimit: 10,
    };
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
</style>
 