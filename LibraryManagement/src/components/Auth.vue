<template>
    <div class="auth-container">
      <!-- Main container -->
      <div class="auth-background">
        <!-- Form Container -->
        <div class="auth-form">
          <h1>Authentification</h1>
          
          <!-- Login Form -->
          <form v-if="!isSignUp" @submit.prevent="handleLogin">
            <h2>𐙚 Log In 𐙚</h2>
            <div class="input-field">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                placeholder="Enter your email"
              />
            </div>
            <div class="input-field">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                v-model="formData.password"
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit">Log In</button>
            <p class="toggle-text">
              Don't have an account? <span @click="toggleSignUp">Sign Up</span>
            </p>
          </form>
  
          <!-- Sign-Up Form -->
          <form v-else @submit.prevent="handleSignUp">
            <h2>𐙚 Sign Up 𐙚</h2>
            <div class="input-field">
              <label for="name">Full Name</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                required
                placeholder="Enter your full name"
              />
            </div>
            <div class="input-field">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                placeholder="Enter your email"
              />
            </div>
            <div class="input-field">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                v-model="formData.password"
                required
                placeholder="Create a password"
              />
            </div>
            <button type="submit">Sign Up</button>
            <p class="toggle-text">
              Already have an account? <span @click="toggleSignUp">Log In</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isSignUp: false,
        formData: {
          name: "",
          email: "",
          password: "",
        },
        users: {}, // Stocke les utilisateurs enregistrés
      };
    },
    mounted() {
      // Charger les utilisateurs stockés
      const storedUsers = localStorage.getItem("users");
      this.users = storedUsers ? JSON.parse(storedUsers) : {};
  
      // Charger l'état de connexion
      const isLoggedIn = localStorage.getItem("userLoggedIn");
      this.$root.isLoggedIn = isLoggedIn === "true"; // Défini dans la barre de navigation
      
      // Charger le rôle utilisateur
      const userRole = localStorage.getItem("userRole");
      this.$root.userRole = userRole || null;
    },
    methods: {
      toggleSignUp() {
        this.isSignUp = !this.isSignUp;
        this.resetForm();
      },
      resetForm() {
        this.formData = {
          name: "",
          email: "",
          password: "",
        };
      },
      handleSignUp() {
        const { name, email, password } = this.formData;
  
        if (this.users[email]) {
          alert("This email is already registered.");
          return;
        }
  
        // Sauvegarder le nouvel utilisateur
        this.users[email] = { name, password };
        localStorage.setItem("users", JSON.stringify(this.users));

        // Sauvegarder le nom d'utilisateur actif
         localStorage.setItem("userName", name);

        alert("Sign-up successful! Please log in.");
        this.isSignUp = false;
        this.resetForm();
      },
      handleLogin() {
        const { email, password } = this.formData;
  
         // Vérifier si les identifiants correspondent
      if (
        email === "libraire_admin@gmail.com" &&
        password === "libraire123"
      ) {
        // Librarian
        this.$root.userRole = "librarian";
        localStorage.setItem("userRole", "librarian");
        this.$root.isLoggedIn = true;
        localStorage.setItem("userLoggedIn", "true");
        
        // Définir le nom et la photo de profil de l'administrateur
        this.$root.userName = "Librarian Admin"; 
        this.$root.profilePhoto = "profileImage.jpg"; 
        localStorage.setItem("userName", "Librarian Admin");
        localStorage.setItem("profilePhoto", "librarian_profile.jpg");

        alert("Welcome Librarian!");
        this.$router.push("/myaccount");
      } else {
        // Member
        const user = this.users[email];
        if (!user || user.password !== password) {
          alert("Invalid credentials.");
          return;
        }

        // Définir le rôle utilisateur
        this.$root.userRole = "member";
        localStorage.setItem("userRole", "member");
        this.$root.isLoggedIn = true;
        localStorage.setItem("userLoggedIn", "true");
        alert(`Welcome back, ${user.name}!`);
        this.$router.push("/myaccount");
      }

      this.resetForm();
    },
      handleLogout() {
        // Déconnexion
        this.$root.isLoggedIn = false;
        this.$root.userRole = null;
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("userRole");
        this.$router.push("/");
      },
    },
  };
  </script>
  
  
  <style scoped>
  /* Main container */
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #fbe8e4, #f6e6d9); /* Fond beige */
  }
  
  .auth-background {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: 90%; /* Augmente la hauteur */
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    background: transparent; /* Supprime le fond blanc */
  }
  
  /* Form Section */
  .auth-form {
    flex: 1.5;
    background: #fffaf4; /* Fond blanc uniquement pour le formulaire */
    padding: 50px; /* Augmente l'espacement interne */
    border-radius: 15px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    max-width: 600px; /* Augmente la largeur */
    min-height: 600px; /* Augmente la hauteur */
  }
  
  .auth-form h1 {
    text-align: center;
    color: #d19090; /* Rose doux */
  }
  
  .auth-form h2 {
  color: #8f3e3e; /* Couleur intérieure du texte */
  font-size: 1.8rem; /* Taille de la police */
  font-weight: bold; /* Épaisseur du texte */
  text-align: center; /* Centrer le texte */
  position: relative; /* Nécessaire pour le soulignement */
  margin-bottom: 20px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Ajoute une ombre douce */ 
}

/* Ajout d'une ligne de soulignement stylisée */
.auth-form h2::after {
  content: "";
  display: block;
  width: 60px; /* Longueur du soulignement */
  height: 3px; /* Épaisseur du soulignement */
  background: #d19090; /* Couleur du soulignement */
  margin: 10px auto 0; /* Centrer le soulignement */
  border-radius: 3px; /* Ajoute des bords arrondis au soulignement */
}
  
  .input-field {
    margin-bottom: 20px; /* Espacement entre les champs */
  }
  
  .input-field label {
    font-weight: bold;
    color: #b36a6a; /* Rose légèrement plus foncé */
  }
  
  .input-field input {
    width: 100%;
    padding: 15px; /* Espacement interne plus grand */
    border: 1px solid #e4cfcf; /* Bordure rose pâle */
    border-radius: 5px;
    margin-top: 5px;
    background-color: #fff5f0; /* Fond très clair */
  }
  
  button {
    width: 100%;
    padding: 15px;
    background-color: rgba(193,118,128,0.578); 
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #b36a6a; /* Rose légèrement plus foncé */
  }
  
  .toggle-text {
    margin-top: 20px;
    text-align: center;
    color: #b36a6a; /* Rose légèrement plus foncé */
    font-size: 0.9rem;
  }
  
  .toggle-text span {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
  
  /* Ajustements pour les petits écrans */
  @media (max-width: 768px) {
    .auth-background {
      width: 95%;
      height: auto;
    }
  
    .auth-form {
      padding: 30px;
      max-width: 100%; /* Prend toute la largeur disponible */
    }
  }
  </style>
  