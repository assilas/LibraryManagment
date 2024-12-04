<template>
    <div class="my-account">
      <h1>My Account</h1>
      
      <!-- l'image par defaut -->
    <div class="profile-image-container">
      <img 
      alt="ProfilePicture" 
      class="profile-image" 
      @click="showAvatarOptions = true" 
      :src="profileImage"/>

     <!-- Options d'avatars (s'affichent au clic) -->
     <div v-if="showAvatarOptions" class="avatar-options">
        <img 
          v-for="(avatar, index) in avatarOptions" 
          :key="index" 
          :src="avatar" 
          class="avatar-option" 
          @click="selectAvatar(avatar)" 
          :alt="'Avatar ' + (index + 1)" 
        />
        <button class="close-options" @click="showAvatarOptions = false">Close</button>
      </div>
    </div>

      <p class="account-name">{{ accountName }}</p>
      
      <button @click="navigateTo('/BorrowingRecords')">Return a Book</button>
      <button @click="navigateTo('/Catalog')">Borrow a Book</button>
      <button @click="navigateTo('/BorrowingRecords')">See My Borrowing Records</button>
    </div>

  </template>
  
  <script>
  export default {
    data() {
    return {
      accountName: '', // Initialisé vide
      profileImage: '', // URL de l'image par défaut
      defaultImage: '/src/assets/img/profileImage.jpg', // Chemin de l'image par défaut
      showAvatarOptions: false, // Affiche ou non les options d'avatars
      avatarOptions: [
        'src/assets/img/avatar1.jpg', // Remplacez par vos chemins d'avatars
        'src/assets/img/avatar2.jpg',
        'src/assets/img/profileImage.jpg',
        ],
    };
  },
  created() {
    // Récupère le nom d'utilisateur depuis localStorage
    this.accountName = localStorage.getItem('userName')|| 'Guest';
    this.profileImage =
      localStorage.getItem('profileImage') || 'path/to/default-image.jpg'; // Remplacez par le chemin de votre image par défaut
  },
    methods: {
      navigateTo(path) {
        this.$router.push(path);
      },
      selectAvatar(avatar) {
      this.profileImage = avatar; // Change l'image de profil
      localStorage.setItem('profileImage', this.profileImage); // Sauvegarde la nouvelle image dans localStorage
      this.showAvatarOptions = false; // Cache les options
     },
    },
  };
  </script>

<style scoped>
.my-account {
  text-align: center;
  font-family: Arial, sans-serif;
  color: #a74369;
  background-color: #f6e1ce;
  padding: 20px;
  border-radius: 10px;
  margin: 50px auto;
  width: 80%;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}
.profile-image-container {
  position: relative;
  display: inline-block;
  margin: 20px auto;
  text-align: center;
}
.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #b65c88;
  transition: transform 0.3s;
}
.profile-image-container:hover .profile-image {
  transform: scale(1.1);
}
.upload-bar {
  display: none; /* Caché par défaut */
  position: absolute;
  bottom: -30px; /* Barre en dessous de l'image */
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}

.upload-bar label {
  cursor: pointer;
}

.upload-bar input {
  display: none; /* Cache le vrai champ de fichier */
}

.profile-image-container:hover .upload-bar {
  display: block; /* Affiche la barre au survol */
}

button {
  background-color: rgba(193,118,128,0.578);
  color: #fefefe;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  font-size: 16px;
}
button:hover {
  background-color:#b36a6a;
}
.account-name {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 30px;
}

.avatar-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.avatar-option {
  width: 65px;
  height: 65px;
  border-radius: 50%; /* Avatars ronds */
  object-fit: cover;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.3s ease, transform 0.2s ease;
}

.avatar-option:hover {
  border-color: #ffcccc; /* Met en avant l'avatar au survol */
  transform: scale(1.1); /* Zoom léger */
}

.close-options {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #ffcccc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-options:hover {
  background-color: #ff9999;
}

</style>