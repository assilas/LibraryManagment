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
            <th>Borrowed Books</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in filteredMembers" :key="member.email">
            <td>{{ member.name }}</td>
            <td>{{ member.email }}</td>
            <td>{{ member.borrowedBooks }}</td>
            <td>
              <button @click="viewActivity(member)">View Activity</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Activity Section -->
      <div v-if="selectedMember" class="activity-section">
        <h2>Activity for {{ selectedMember.name }}</h2>
        <p><strong>Borrowed Books:</strong> {{ selectedMember.borrowedBooks }}</p>
        <p><strong>Books Title:</strong> {{ }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: "",
        selectedMember: null,
        members: [
          {
            name: "Alice Smith",
            email: "alice@gmail.com",
            borrowedBooks: 3,
          },
          {
            name: "Bob Johnson",
            email: "bob@gmail.com",
            borrowedBooks: 2,
          },
        ],
      };
    },
    computed: {
      filteredMembers() {
        return this.members.filter((member) =>
          [member.name, member.email]
            .join(" ")
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      },
    },
    methods: {
      viewActivity(member) {
        this.selectedMember = member;
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
    background-color: rgba(193, 118, 128, 0.578);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #b36a6a;
  }
  </style>
  