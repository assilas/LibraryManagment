<template>
    <div :class="`login-container ${role}`">
      <h1>Library Management</h1>
      <div class="role-switch">
        <button
          :class="{ active: role === 'librarian' }"
          @click="setRole('librarian')"
        >
          Librarian
        </button>
        <button
          :class="{ active: role === 'member' }"
          @click="setRole('member')"
        >
          Member
        </button>
      </div>
  
      <!-- Login Form -->
      <form v-if="!isSignUp" @submit.prevent="handleLogin">
        <h2>{{ role === 'librarian' ? 'Librarian Login' : 'Member Login' }}</h2>
        <div>
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Log In</button>
        <p class="toggle-text">
          Don't have an account? <span @click="toggleSignUp">Sign Up</span>
        </p>
      </form>
  
      <!-- Sign-Up Form -->
      <form v-else @submit.prevent="handleSignUp">
        <h2>{{ role === 'librarian' ? 'Librarian Sign Up' : 'Member Sign Up' }}</h2>
        <div>
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            required
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            required
            placeholder="Create a password"
          />
        </div>
        <button type="submit">Sign Up</button>
        <p class="toggle-text">
          Already have an account? <span @click="toggleSignUp">Log In</span>
        </p>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        role: "librarian", // Default role
        isSignUp: false, // Tracks if user is signing up
        formData: {
          name: "",
          email: "",
          password: "",
        },
        users: {}, // Simulated database (will use localStorage)
      };
    },
    mounted() {
      // Load users from localStorage
      const storedUsers = localStorage.getItem("users");
      this.users = storedUsers ? JSON.parse(storedUsers) : {};
    },
    methods: {
      setRole(selectedRole) {
        this.role = selectedRole;
      },
      toggleSignUp() {
        this.isSignUp = !this.isSignUp;
        this.resetForm();
      },
      resetForm() {
        this.formData = {
          name: "",
          email: "",
          password: "",
        };
      },
      handleSignUp() {
        const { name, email, password } = this.formData;
  
        // Check if email already exists
        if (this.users[email]) {
          alert("This email is already registered.");
          return;
        }
  
        // Create new user
        this.users[email] = { name, password, role: this.role };
        localStorage.setItem("users", JSON.stringify(this.users));
  
        alert("Sign-up successful! Please log in.");
        this.isSignUp = false;
        this.resetForm();
      },
      handleLogin() {
        const { email, password } = this.formData;
  
        // Check if user exists
        const user = this.users[email];
        if (!user || user.password !== password || user.role !== this.role) {
          alert("Invalid credentials or role.");
          return;
        }
  
        alert(`Welcome back, ${user.name}!`);
        this.resetForm();
      },
    },
  };
  </script>
  
  <style scoped>
  /* Same styling with small improvements */
  .login-container {
    width: 100%;
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .login-container.librarian {
    background-color: #e8e1f7; /* Light purple */
    border: 2px solid #8a2be2; /* Darker purple */
  }
  
  .login-container.member {
    background-color: #ffe4e6; /* Light pink */
    border: 2px solid #ff69b4; /* Hot pink */
  }
  
  h1 {
    color: #333;
    margin-bottom: 20px;
  }
  
  .role-switch {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .role-switch button {
    flex: 1;
    padding: 10px;
    border: none;
    background: #f0f0f0;
    cursor: pointer;
    font-weight: bold;
    border-radius: 4px;
    margin: 0 5px;
  }
  
  .role-switch button.active {
    background: #8a2be2;
    color: white;
  }
  
  .role-switch .active:nth-child(2) {
    background: #ff69b4;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  form div {
    margin-bottom: 15px;
    text-align: left;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 10px;
    border: none;
    background: #8a2be2;
    color: white;
    font-weight: bold;
    cursor: pointer;
    border-radius: 4px;
  }
  
  button:hover {
    background: #6a1cb3;
  }
  
  .login-container.member button {
    background: #ff69b4;
  }
  
  .login-container.member button:hover {
    background: #e05493;
  }
  
  .toggle-text {
    margin-top: 10px;
    cursor: pointer;
    color: #8a2be2;
    font-size: 0.9rem;
  }
  
  .toggle-text span {
    text-decoration: underline;
    font-weight: bold;
  }
  </style>
  