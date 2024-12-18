
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
      async loginUser() {
        try {
            const response = await this.$http.post('/login', { email: this.email, password: this.password });

            // Vérification si l'utilisateur est un libraire
            if (response.data.role === 'librarian') {
                // Si c'est un libraire, on met à jour le localStorage et on redirige
                localStorage.setItem('userRole', 'librarian');
                localStorage.setItem('token', response.data.token);
                this.$root.userRole = 'librarian';
                this.$router.push('/MyAccount');
            } else {
                // Gérer les autres utilisateurs (membres)
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('token', response.data.token);
                this.$root.userRole = response.data.role;
                this.$router.push('/Dashboard'); // Redirection vers le tableau de bord
            }

            this.$root.isLoggedIn = true; // Met à jour l'état de connexion
        } catch (error) {
            alert('Invalid credentials');
        }
    },
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
      async handleSignUp() {
        const { name, email, password } = this.formData;

        console.log('Sending data to server:', { name, email, password }); // Log des données envoyées

        try {
          const response = await fetch('http://localhost:3001/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: name, email, password }),
          });

          const result = await response.json();
          console.log('Server response:', result); // Log de la réponse du serveur

          if (response.ok) {
            alert('Sign-up successful! Please log in.');
            this.isSignUp = false;
            this.resetForm();
          } else {
            alert(result.error || 'Failed to sign up.');
          }
        } catch (error) {
          console.error('Error during sign-up:', error);
          alert('An error occurred during sign-up. Please try again.');
        }
      },

      async handleLogin() {
        const { email, password } = this.formData;

        try {
          // Envoie une requête de connexion au backend
          const response = await fetch('http://localhost:3001/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const result = await response.json();

          if (response.ok) {
            alert(result.message); // Affiche le message renvoyé par le serveur

            // Stocke les informations renvoyées par le serveur dans le localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('userRole', result.user.role);
            localStorage.setItem('userName', result.user.username);

            // Met à jour l'état global de connexion
            this.$emit('update-login-state', {
              isLoggedIn: true,
              userRole: result.user.role,
            });

            // Redirection basée sur le rôle de l'utilisateur
            if (result.user.role === 'librarian') {
              this.$router.push('/MyAccount'); // Page du librarian
            } else {
              this.$router.push('/MyAccount'); // Page pour les membres
            }
          } else {
            alert(result.error || 'Login failed. Check your credentials.');
          }
        } catch (err) {
          console.error('Login error:', err);
          alert('An error occurred during login. Please try again.');
        }
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