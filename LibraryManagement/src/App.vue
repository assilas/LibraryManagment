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

      <!-- AJOUT : Icône Panier avec compteur -->
      <router-link to="/cart" class="cart-link">
        🛒 <span class="cart-count">{{ cartCount }}</span>
      </router-link>

      <!-- Notification Icon -->
      <div class="notification-icon" @click="openNotifications">
        📩 <span class="notification-count">{{ notifications.length }}</span>
      </div>

    </nav>

    <!-- Notification Dropdown -->
    <div v-if="showNotifications" class="notification-dropdown">
      <ul>
        <li v-for="(notification, index) in notifications" :key="index">
          {{ notification }}
        </li>
        <li v-if="notifications.length === 0" class="empty-message">No notifications</li>
      </ul>
    </div>

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
      cartCount: 0, // Compteur pour le panier
      notifications: [], // Tableau de notifications
      showNotifications: false, // Contrôle l'affichage du menu des notifications
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
    updateCartCount() {
      // Récupère les livres dans le panier depuis localStorage
      const cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
      this.cartCount = cart.length;
    },
    addNotification(notification) {
      this.notifications.push(notification);
    },
    openNotifications() {
      this.showNotifications = !this.showNotifications;
    },
  },
  mounted() {
    // Synchronise avec le localStorage au montage
    this.updateLoginState({
      isLoggedIn: !!localStorage.getItem("token"),
      userRole: localStorage.getItem("userRole") || null,
    });
    this.updateCartCount(); // Met à jour le compteur du panier

    // Écoute l'événement "cart-updated" pour mettre à jour dynamiquement
    window.addEventListener("cart-updated", this.updateCartCount);
  },
  beforeUnmount() {
    // Retire l'écouteur d'événement
    window.removeEventListener("cart-updated", this.updateCartCount);
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

/* AJOUT : Style pour l'icône Panier */
.cart-link {
  position: relative;
  margin-left: 25px;
}

.cart-count {
  position: absolute;
  top: -10px;
  right: -15px;
  background-color: rgba(255, 0, 0, 0.584);
  color: white;
  border-radius: 50%;
  padding: 5px 8px;
  font-size: 12px;
  font-weight: bold;
}
</style>