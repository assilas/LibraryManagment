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

    <!-- Account Name -->
    <p class="account-name">{{ accountName }}</p>

    <!-- Buttons -->
    <div>
      <button v-if="userRole === 'member'" @click="navigateTo('/BorrowingRecords')">Return a Book</button>
      <button v-if="userRole === 'member'" @click="navigateTo('/Catalog')">Borrow a Book</button>
      <button v-if="userRole === 'member'" @click="navigateTo('/BorrowingRecords')">See My Borrowing Records</button>

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
        'src/assets/img/avatar1.jpg',
        'src/assets/img/avatar2.jpg',
        'src/assets/img/profileImage.jpg',
      ],
      userRole: '',
    };
  },
  async created() {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);

    if (!token) {
      alert('No token found. Please log in.');
      this.$router.push('/auth');
      return;
    }

    try {
      const res = await axios.get('http://localhost:3001/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API Response:', res.data);

      this.accountName = res.data.username;
      this.userRole = res.data.role;
      this.profileImage = localStorage.getItem('profileImage') || this.defaultImage;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.error('Unauthorized - Token invalid or expired');
      } else {
        console.error('Error fetching profile:', err);
      }
      alert('Session expired or invalid. Please log in again.');
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
  transition: transform 0.3s;
}
.profile-image-container:hover .profile-image {
  transform: scale(1.1);
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
