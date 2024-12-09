<template>
    <div>
      <nav>
        <img src="@/assets/img/Books_and_Noble_Logo.png" alt="B&Nlogo" width="150px" height="80px">
        <router-link to="/">Home</router-link>
        <router-link to="/Catalog">Catalog</router-link>
       <!-- Liens pour les membres connectés -->
      <router-link v-if="isLoggedIn && userRole === 'member'" to="/MyAccount">My Account</router-link>
      <router-link v-if="isLoggedIn && userRole === 'member'" @click.prevent="handleLogout" to="/">Log Out</router-link>

      <!-- Liens pour les librarians connectés -->
      <router-link v-if="isLoggedIn && userRole === 'librarian'" to="/MyAccount">My Account</router-link>
      <router-link v-if="isLoggedIn && userRole === 'librarian'" @click.prevent="handleLogout" to="/">Log Out</router-link>

      <!-- Lien pour les utilisateurs non connectés -->
      <router-link v-else to="/Authentification">Authentification</router-link>
    </nav>
      <router-view></router-view>
    </div>
</template>
  
<script>
export default {
  data() {
    return {
      isLoggedIn: false, // Variable pour suivre l'état d'authentification
      userRole: null,
    };
  },
  methods: {
    handleLogout() {
      // Déconnecte l'utilisateur
      this.isLoggedIn = false;
      this.userRole = null;
      localStorage.removeItem("userLoggedIn"); // Supprime l'état du stockage local
      localStorage.removeItem("userRole");
    },
  },
  mounted() {
    // Vérifie si un utilisateur est connecté (depuis le localStorage ou un autre système)
    const userStatus = localStorage.getItem("userLoggedIn");
    this.isLoggedIn = userStatus === "true";
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
    transform : translateY(30%);
}


nav a:hover {
    color: rgba(198, 78, 94);
}
</style>