<template>
  <div>
    <nav>
      <img src="@/assets/img/Books_and_Noble_Logo.png" alt="B&Nlogo" width="150px" height="80px">
      <router-link to="/">Home</router-link>
      <router-link to="/Catalog">Catalog</router-link>

      <!-- Liens pour les personnes connectés -->
      <router-link v-if="isLoggedIn" to="/MyAccount">My Account</router-link>
      <router-link v-if="isLoggedIn" @click.prevent="handleLogout" to="/">Log Out</router-link>

      <!-- Lien pour les utilisateurs non connectés -->
      <router-link v-else to="/Authentification">Authentification</router-link>
    </nav>
    <router-view
      :isLoggedIn="isLoggedIn"
      :userRole="userRole"
      @update-login-state="updateLoginState"
      :key="$route.fullPath"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: !!localStorage.getItem("token"), // Vérifie si un token existe
      userRole: localStorage.getItem("userRole") || null, // Récupère le rôle depuis localStorage
    };
  },
  methods: {
    handleLogout() {
      // Supprime les données du localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");

      // Mets à jour les données locales
      this.isLoggedIn = false;
      this.userRole = null;

      alert("You have been logged out.");
      this.$router.push("/Authentification");
    },
    updateLoginState({ isLoggedIn, userRole }) {
      // Mets à jour les données locales
      this.isLoggedIn = isLoggedIn;
      this.userRole = userRole;
    },
  },
  mounted() {
    // Synchronise avec le localStorage au montage
    this.updateLoginState({
      isLoggedIn: !!localStorage.getItem("token"),
      userRole: localStorage.getItem("userRole") || null,
    });
  },
};
</script>

<style>
nav {
  display: flex;
  font-size: 20px;
  justify-content: center;
  margin-bottom: 20px;
  background-color: rgba(193, 118, 128, 0.578);
  padding: 12px;
  border-radius: 8px;
}

nav a {
  margin: 0 25px;
  text-decoration: none;
  color: rgba(198, 78, 94, 0.721);
  font-weight: bold;
  transition: color 0.3s ease;
  transform: translateY(30%);
}

nav a:hover {
  color: rgba(198, 78, 94);
}
</style>
