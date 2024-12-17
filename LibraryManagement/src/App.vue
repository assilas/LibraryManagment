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

      <div class="notification-link movable-icon" @click="toggleNotifications" style="--icon-top: 20px;">
        <span class="icon">📩</span>
        <span class="notification-count">{{ notifications.length }}</span>
      </div>



    </nav>

  <div v-if="showNotifications" class="notification-window">
    <h3>Notifications</h3>
    <ul>
      <li v-for="(notification, index) in notifications" :key="index">
        {{ notification }}
      </li>
      <!-- Message par défaut si aucune notification -->
      <li v-if="notifications.length === 0" class="empty-message">
        There is no notifications yet. 
      </li>
    </ul>
  </div>


    <router-view
      :isLoggedIn="isLoggedIn"
      :userRole="userRole"
      @update-login-state="updateLoginState"
      @send-notification="addNotification"
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
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    clearNotifications() {
      this.notifications = [];
      this.showNotifications = false;
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
/* Conteneur principal pour la notification */
.notification-link {
  position: relative;
  display: inline-block;
  font-size: 20px;
  margin-left: 25px;
  cursor: pointer;
}

/* Style de l'icône */
.notification-link .icon {
  font-size: 24px;
}

/* Style du badge rouge */
.notification-link .notification-count {
  position: absolute;
  top: -7px;
  right: -11px;
  background-color: rgba(255, 0, 0, 0.584);
  color: white;
  border-radius: 50%;
  padding: 5px 8px;
  font-size: 12px;
  font-weight: bold;
}

/* Classe pour rendre l'icône déplaçable */
.movable-icon {
  position: relative; /* Position relative pour le déplacer */
  top: var(--icon-top, 19px); /* Contrôle vertical */
  left: var(--icon-left, 10px); /* Optionnel : contrôle horizontal */
}
.notification-window {
  position: absolute;
  top: 100px; /* Décalé sous le nav */
  right: 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 15px;
  width: 250px;
  z-index: 1000;
}

.notification-window h3 {
  margin-top: 0;
  font-size: 18px;
  color: #875151;
  text-align: center;
}

.empty-message {
  font-size: 14px;
  color: #888;
  text-align: center;
}

.notification-window ul {
  list-style: none;
  padding: 0;
}

.notification-window li {
  margin-bottom: 10px;
  font-size: 14px;
  color: #9c7171;
}


</style>