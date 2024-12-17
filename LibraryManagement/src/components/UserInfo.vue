<template>
    <div class="user-info-container">
      <h1>Verify Your Information</h1>
      <form @submit.prevent="finalizeBorrow">
        <div class="form-group">
          <label for="username">Full Name</label>
          <input
            type="text"
            id="username"
            v-model="user.username"
            placeholder="Enter your full name"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="user.email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="form-group">
          <label for="address">Address</label>
          <input
            type="text"
            id="address"
            v-model="user.address"
            placeholder="Enter your address"
            required
          />
        </div>
        <div class="form-group">
          <label for="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            v-model="user.phoneNumber"
            maxlength="10"
            pattern="[0-9]{10}"
            placeholder="Enter your phone number"
            required
          />
        </div>
        <button type="submit">Finalize Borrow</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        user: {
          username: "",
          email: "",
          address: "",
          phoneNumber: "",
        },
        borrowedBooksCount: 0, // Pour le nombre de livres empruntés
      };
    },
    methods: {
      async fetchUserInfo() {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:3001/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.user = response.data; // Charge les infos utilisateur
  
          // Compte les livres sélectionnés dans le panier
          const cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
          this.borrowedBooksCount = cart.length;
        } catch (error) {
          console.error("Error fetching user info:", error);
          alert("Session expired. Please log in again.");
          this.$router.push("/Authentification");
        }
      },
      async finalizeBorrow() {
        const token = localStorage.getItem("token");
        const selectedBooks = JSON.parse(localStorage.getItem("selectedBooksForBorrow")) || [];
        console.log("Books being borrowed:", selectedBooks);

        try {
            // Mise à jour des informations utilisateur
            await axios.put("http://localhost:3001/users/update", { ...this.user }, {
            headers: { Authorization: `Bearer ${token}` },
            });

            // Mettre à jour le nombre de livres empruntés
            const response = await axios.put("http://localhost:3001/users/finalize-borrow", {
            borrowedCount: selectedBooks.length,
            }, {
            headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Borrow response:", response.data);

            alert(`Borrow confirmed. You have borrowed ${selectedBooks.length} books.`);
            localStorage.removeItem("shoppingCart");
            localStorage.removeItem("selectedBooksForBorrow");
            this.$router.push("/");
        } catch (error) {
            console.error("Error finalizing borrow:", error.response?.data || error.message);
            alert("Failed to finalize borrow. Please try again.");
        }
        }
    },
    mounted() {
      this.fetchUserInfo();
    },
  };
  </script>
  
<style scoped>
    .user-info-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #fff9f9;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    }

    form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center; /* Centre les éléments horizontalement */
    }

    .form-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%; /* Prend toute la largeur disponible */
    max-width: 100%; /* Garde les champs alignés */
    }

    .form-group label {
    font-weight: bold;
    color: #333;
    font-size: 1rem;
    }

    input {
    width: calc(100% - 25px); /* Ajuste la largeur pour garder une marge */
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: border 0.3s ease, box-shadow 0.3s ease;
    }

    input:focus {
    border-color: #61c48a;
    outline: none;
    box-shadow: 0 0 5px rgba(97, 196, 138, 0.5);
    }

    button {
    width: calc(100% - 10px);
    padding: 0.8rem 1.5rem;
    margin-top: 1rem;
    background-color: #61c48a;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s ease;
    }

    button:hover {
    background-color: #4aa570;
    }      
</style>