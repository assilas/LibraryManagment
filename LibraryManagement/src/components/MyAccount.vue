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
      </div>

      <div v-if="userRole === 'librarian'">
        <button @click="navigateTo('/ManageBooksReturn')">Manage Book Returns</button>
        <button @click="navigateTo('/MembershipManagement')">Manage Memberships</button>
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
      userRole: '',
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

      this.accountName = res.data.username;
      this.userRole = res.data.role ? res.data.role.toLowerCase() : 'member';
      this.profileImage = localStorage.getItem('profileImage') || this.defaultImage;
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
</style>
