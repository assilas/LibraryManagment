<template>
    <div class="user-info-container">
      <h1>Verify and Update Your Information</h1>
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
        } catch (error) {
          console.error("Error fetching user info:", error);
          alert("Session expired. Please log in again.");
          this.$router.push("/Authentification");
        }
      },
      async finalizeBorrow() {
        // Validation du numéro de téléphone
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(this.user.phoneNumber)) {
          alert("Phone number must be exactly 10 digits.");
          return;
        }
  
        try {
          const token = localStorage.getItem("token");
  
          // Mettre à jour les informations utilisateur
          await axios.put(
            "http://localhost:3001/users/update",
            {
              username: this.user.username,
              email: this.user.email,
              address: this.user.address,
              phoneNumber: this.user.phoneNumber,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
  
          alert("Borrow confirmed. Thank you!");
          this.$router.push("/");
        } catch (error) {
          console.error("Error finalizing borrow:", error);
          alert(
            error.response?.data?.error || "Failed to finalize borrow. Please try again."
          );
        }
      },
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
    padding: 1.5rem;
    background-color: #fff9f9;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-group label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
  }
  
  input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  button {
    padding: 0.8rem 1.5rem;
    background-color: #61c48a;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  button:hover {
    background-color: #4aa570;
  }
  </style>