<template>
  <div class="membership-management">
    <h1>📚 Membership Management</h1>

    <!-- Search Bar -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        placeholder="Search by member name or email"
        class="search-input"
      />
    </div>

    <!-- Members Table -->
    <table class="members-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member in filteredMembers" :key="member.id">
          <td>{{ member.username }}</td>
          <td>{{ member.email }}</td>
          <td>
            <button @click="openModal(member)">View Activity</button>
            <button @click="removeMember(member.id)" class="remove-btn">Remove Member</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Window -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Member Details</h2>
        <p><strong>Name:</strong> {{ selectedMember.username }}</p>
        <p><strong>Email:</strong> {{ selectedMember.email }}</p>
        <button class="close-btn" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: "",
      showModal: false,
      selectedMember: null,
      members: [],
    };
  },
  computed: {
    filteredMembers() {
      return this.members.filter((member) =>
        [member.username, member.email]
          .join(" ")
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    },
  },
  created() {
    this.loadMembers();
  },
  methods: {
    async loadMembers() {
      try {
        const response = await axios.get("http://localhost:3001/users/members");
        this.members = response.data;
      } catch (error) {
        console.error("Erreur lors du chargement des membres :", error);
        alert("Failed to load members data.");
      }
    },
    openModal(member) {
      this.selectedMember = member;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedMember = null;
    },
    async removeMember(memberId) {
      if (confirm("Are you sure you want to remove this member?")) {
        try {
          await axios.delete(`http://localhost:3001/users/delete/${memberId}`);
          this.members = this.members.filter((member) => member.id !== memberId);
          alert("Member removed successfully!");
        } catch (error) {
          console.error("Error removing member:", error);
          alert("Failed to remove member.");
        }
      }
    },
  },
};
</script>

<style scoped>
.membership-management {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: linear-gradient(135deg, #fbe8e4, #f6e6d9);
}

h1 {
  color: #d19090;
  font-size: 2rem;
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border: 1px solid #e4cfcf;
  border-radius: 5px;
  background-color: #fff5f0;
}

.members-table {
  width: 100%;
  max-width: 800px;
  border-collapse: collapse;
}

.members-table th,
.members-table td {
  border: 1px solid #e4cfcf;
  padding: 15px;
  text-align: center;
}

.members-table th {
  background: #fffaf4;
  color: #8f3e3e;
}

button {
  padding: 10px 15px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

.remove-btn {
  background-color: #e57373;
  color: white;
}

.close-btn {
  margin-top: 10px;
  background-color: #d19090;
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

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}
</style>
