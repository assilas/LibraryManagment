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
            <button @click="openModal(member)" class="action-btn">View Activity</button>
            <button @click="removeMember(member.id)" class="action-btn remove-btn">
              Remove Member
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Window -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-window">
        <h2 class="modal-title">{{ isEditing ? "Modify Info" : "Member Details" }}</h2>

        <!-- View Activity -->
        <div v-if="!isEditing">
          <p><strong>Name:</strong> {{ selectedMember.username }}</p>
          <p><strong>Email:</strong> {{ selectedMember.email }}</p>
          <p><strong>Address:</strong> {{ selectedMember.address || "N/A" }}</p>
          <p><strong>Phone Number:</strong> {{ selectedMember.phoneNumber || "N/A" }}</p>
          <p><strong>Borrowed Books:</strong> {{ selectedMember.borrowedBooks }}</p>
          <div class="button-group">
            <button @click="toggleEditMode" class="action-btn modify-btn">Modify Info</button>
            <button @click="closeModal" class="action-btn close-btn">Close</button>
          </div>
        </div>

        <!-- Modify Info -->
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
            <button @click="updateMemberInfo" class="action-btn save-btn">Save</button>
            <button @click="toggleEditMode" class="action-btn back-btn">Back</button>
            <button @click="closeModal" class="action-btn close-btn">Close</button>
          </div>
        </div>
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
      isEditing: false,
      selectedMember: null,
      members: [],
      editForm: {
        username: "",
        email: "",
        address: "",
        phoneNumber: "",
      },
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
        console.error("Error loading members:", error);
      }
    },
    openModal(member) {
      this.selectedMember = { ...member }; // Copie les données pour éviter les conflits
      this.editForm = {
        username: member.username,
        email: member.email,
        address: member.address || "",
        phoneNumber: member.phoneNumber || "",
      };
      this.isEditing = false;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.isEditing = false;
    },
    toggleEditMode() {
      this.isEditing = !this.isEditing;
    },
    async updateMemberInfo() {
      try {
        await axios.put(
          `http://localhost:3001/users/update/${this.selectedMember.id}`,
          {
            username: this.editForm.username,
            email: this.editForm.email,
            address: this.editForm.address,
            phoneNumber: this.editForm.phoneNumber,
          }
        );
        alert("Member information updated successfully!");

        // Recharger les membres après la mise à jour
        await this.loadMembers();
        this.closeModal();
      } catch (error) {
        console.error("Error updating member info:", error);
        alert("Failed to update member information.");
      }
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
  border-radius: 10px;
  background-color: #fff5f0;
}

.members-table {
  width: 100%;
  max-width: 800px;
  border-collapse: collapse;
  border: 1.5px solid #ac4e4e;
}

.members-table th {
  background-color: #f8c0c0;
  color: #ac4e4e;
  font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  padding: 15px;
}

.members-table td {
  border: 1px solid #ac4e4e;
  padding: 15px;
  text-align: center;
}

.action-btn {
  background-color: #f6a5a5;
  color: white;
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s ease;
}

.action-btn:hover {
  background-color: #e57373;
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
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 300px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.modal-title {
  color: #d87e7e;
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.input-field {
  width: 90%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #e4cfcf;
  border-radius: 5px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
