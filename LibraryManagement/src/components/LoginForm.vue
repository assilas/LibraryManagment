<template>
    <div class="login-container">
      <h1>Library Management - Login</h1>
      <div class="tabs">
        <button
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          Log In
        </button>
        <button
          :class="{ active: activeTab === 'signup' }"
          @click="activeTab = 'signup'"
        >
          Sign Up
        </button>
      </div>
  
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin">
        <h2>Log In</h2>
        <div>
          <label for="role">Role</label>
          <select v-model="role" id="role" required>
            <option value="admin">Administrator</option>
            <option value="member">Member</option>
          </select>
        </div>
        <div>
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="loginData.email"
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="loginData.password"
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Log In</button>
      </form>
  
      <form v-else @submit.prevent="handleSignup">
        <h2>Sign Up</h2>
        <div>
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            v-model="signupData.name"
            required
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label for="email-signup">Email</label>
          <input
            type="email"
            id="email-signup"
            v-model="signupData.email"
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label for="password-signup">Password</label>
          <input
            type="password"
            id="password-signup"
            v-model="signupData.password"
            required
            placeholder="Enter a password"
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        activeTab: "login", // Toggle between login and signup
        role: "member", // Default role
        loginData: {
          email: "",
          password: "",
        },
        signupData: {
          name: "",
          email: "",
          password: "",
        },
      };
    },
    methods: {
      handleLogin() {
        alert(
          `Logging in as ${this.role.toUpperCase()} with email: ${this.loginData.email}`
        );
        // Add API call logic here
      },
      handleSignup() {
        alert(
          `Signing up as MEMBER with name: ${this.signupData.name}, email: ${this.signupData.email}`
        );
        // Add API call logic here
      },
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    width: 100%;
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
    text-align: center;
  }
  
  .tabs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .tabs button {
    flex: 1;
    padding: 10px;
    background: #f0f0f0;
    border: none;
    cursor: pointer;
    font-weight: bold;
  }
  
  .tabs button.active {
    background: #007bff;
    color: white;
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
  
  input,
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 10px;
    border: none;
    background: #007bff;
    color: white;
    font-weight: bold;
    cursor: pointer;
    border-radius: 4px;
  }
  
  button:hover {
    background: #0056b3;
  }
  </style>
  