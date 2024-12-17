<template>
  <div class="my-account">
    <h1>My Account</h1>

    <!-- Profile Image -->
    <div class="profile-image-container">
      <img
        alt="ProfilePicture"
        class="profile-image"
        @click="showAvatarOptions = true"
        :src="profileImage"
      />

      <!-- Avatar Options -->
      <div v-if="showAvatarOptions" class="avatar-options-container">
        <div class="avatar-options">
          <img
            v-for="(avatar, index) in avatarOptions"
            :key="index"
            :src="avatar"
            class="avatar-option"
            @click="selectAvatar(avatar)"
            :alt="'Avatar ' + (index + 1)"
          />
        </div>
        <button class="close-options" @click="showAvatarOptions = false">Close</button>
      </div>
    </div>

    <!-- Account Name -->
    <p class="account-name">{{ accountName }}</p>

    <!-- Buttons -->
    <div>
      <div v-if="userRole === 'member'">
        <button @click="navigateTo('/Catalog')">Borrow a Book</button>
        <button @click="navigateTo('/BorrowingRecords')">Borrowing Records</button>
        <button @click="openEditModal" class="edit-btn">Modify Information</button>
      </div>

      <div v-if="userRole === 'librarian'">
        <button @click="navigateTo('/ManageBooksReturn')">Manage Book Returns</button>
        <button @click="navigateTo('/MembershipManagement')">Manage Memberships</button>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-window">
        <h2 class="modal-title">{{ isEditing ? "Modify Info" : "Member Details" }}</h2>

        <!-- Display information before editing -->
        <div v-if="!isEditing">
          <p><strong>Name:</strong> {{ accountName }}</p>
          <p><strong>Email:</strong> {{ editForm.email }}</p>
          <p><strong>Address:</strong> {{ editForm.address || "N/A" }}</p>
          <p><strong>Phone Number:</strong> {{ editForm.phoneNumber || "N/A" }}</p>
          <div class="button-group">
            <button @click="toggleEditMode" class="action-btn modify-btn">Modify Info</button>
            <button @click="closeModal" class="action-btn close-btn">Close</button>
          </div>
        </div>

        <!-- Form to edit information -->
        <div v-else>
          <input v-model="editForm.username" placeholder="Enter new name" class="input-field" />
          <input v-model="editForm.email" placeholder="Enter new email" class="input-field" />
          <input v-model="editForm.address" placeholder="Enter new address" class="input-field" />
          <input
            v-model="editForm.phoneNumber"
            placeholder="Enter phone number"
            class="input-field"
          />
          <div class="button-group">
            <button @click="updateUserInfo" class="action-btn save-btn">Save</button>
            <button @click="toggleEditMode" class="action-btn back-btn">Back</button>
            <button @click="closeModal" class="action-btn close-btn">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      accountName: '',
      profileImage: '',
      defaultImage: '/src/assets/img/profileImage.jpg',
      showAvatarOptions: false,
      avatarOptions: [
        'src/assets/img/avatar1.webp',
        'src/assets/img/avatar2.webp',
        'src/assets/img/avatar3.webp',
        'src/assets/img/avatar4.webp',
        'src/assets/img/avatar5.webp',
      ],
      showEditModal: false,
      userRole: '',
      isEditing: false,
      editForm: {
        id: '', // Ajout de l'ID ici
        username: '',
        email: '',
        address: '',
        phoneNumber: '',
      },
    };
  },
  async created() {
    
    const token = localStorage.getItem('token');

    if (!token) {
      alert('No token found. Please log in.');
      this.$router.push('/auth');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('http://localhost:3001/users/profile', { headers });

      console.log("Données reçues du backend :", res.data);


      this.accountName = res.data.username;
      this.userRole = res.data.role ? res.data.role.toLowerCase() : 'member';
      this.profileImage = localStorage.getItem('profileImage') || this.defaultImage;
      this.editForm = {
        id: res.data.id, // Assurer que l'ID est bien récupéré
        username: res.data.username,
        email: res.data.email,
        address: res.data.address || '',
        phoneNumber: res.data.phoneNumber || '',
      };

    } catch (err) {
      console.error('Error fetching profile:', err.message);
      alert('Session expired or invalid. Please log in again.');
      localStorage.clear();
      this.$router.push('/auth');
    }
  },
  methods: {
    navigateTo(page) {
      this.$router.push(page);
    },
    selectAvatar(avatar) {
      this.profileImage = avatar;
      localStorage.setItem('profileImage', this.profileImage);
      this.showAvatarOptions = false;
    },
    openEditModal() {
      this.showEditModal = true;
      this.isEditing = false; // Start in "view" mode
    },
    closeModal() {
      this.showEditModal = false;
    },
    toggleEditMode() {
      this.isEditing = !this.isEditing;
    },
    async updateUserInfo() {
      try {
        console.log("User ID envoyé :", this.editForm.id);

        // Vérifier si l'ID est défini
        if (!this.editForm.id) {
          alert('User ID is missing.');
          return;
        }

        const token = localStorage.getItem('token'); // Récupérer le token JWT
        const headers = { Authorization: `Bearer ${token}` };

        
        // Envoyer les informations mises à jour au serveur
        const response = await axios.put(
          `http://localhost:3001/users/update/${this.editForm.id}`,
          {
            id: this.editForm.id,
            username: this.editForm.username,
            email: this.editForm.email,
            address: this.editForm.address,
            phoneNumber: this.editForm.phoneNumber,
          },
          { headers }
        );

        // Si la mise à jour réussit
        if (response.status === 200) {
          alert("Votre information a été mise à jour avec succès!");
          this.accountName = this.editForm.username;
          this.closeModal(); // Fermer le modal
        }

       } catch (err) {
    console.error('Error fetching profile:', err.message);
    alert('Session expired or invalid. Please log in again.');
    localStorage.clear();
    this.$router.push('/auth');
  }
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
  cursor: pointer;
  transition: transform 0.3s, border-color 0.3s;
}

.profile-image:hover {
  transform: scale(1.1);
  border-color: #8e3d5c;
}

/* Avatar Options Container */
.avatar-options-container {
  position: absolute;
  top: 170px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.avatar-options {
  display: grid;
  grid-template-columns: repeat(3, 80px);
  gap: 15px;
  justify-content: center;
}

.avatar-option {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid transparent;
  cursor: pointer;
  transition: transform 0.3s, border-color 0.3s;
}

.avatar-option:hover {
  transform: scale(1.1);
  border-color: #b65c88;
}

.close-options {
  margin-top: 15px;
  background-color: #b65c88;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.close-options:hover {
  background-color: #8e3d5c;
}

button {
  background-color: rgba(193, 118, 128, 0.578);
  color: #fefefe;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #b36a6a;
}

.account-name {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 30px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-window {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.input-field {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.button-group button {
  margin: 10px;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.save-btn {
  background-color: #4caf4fb1;
  color: white;
}

.save-btn:hover{
  background-color: #317133cb;
}

.close-btn {
  background-color: #f44336b6;
  color: white;
}

.close-btn:hover{
  background-color: #b5352cb6;
}

.edit-btn {
  margin-top: 20px;
  background-color: #a74369;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #8e3d5c;
}

</style>
