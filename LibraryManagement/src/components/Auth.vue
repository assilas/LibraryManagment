<template>
    <div class="auth-container">
      <!-- Main container -->
      <div class="auth-background">
        <!-- Form Container -->
        <div class="auth-form">
          <h1>Library Management</h1>
          
          <!-- Login Form -->
          <form v-if="!isSignUp" @submit.prevent="handleLogin">
            <h2>Log In</h2>
            <div class="input-field">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                placeholder="Enter your email"
              />
            </div>
            <div class="input-field">
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
            <h2>Sign Up</h2>
            <div class="input-field">
              <label for="name">Full Name</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                required
                placeholder="Enter your full name"
              />
            </div>
            <div class="input-field">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                placeholder="Enter your email"
              />
            </div>
            <div class="input-field">
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
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isSignUp: false,
        formData: {
          name: "",
          email: "",
          password: "",
        },
        users: {},
      };
    },
    mounted() {
      const storedUsers = localStorage.getItem("users");
      this.users = storedUsers ? JSON.parse(storedUsers) : {};
    },
    methods: {
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
  
        if (this.users[email]) {
          alert("This email is already registered.");
          return;
        }
  
        this.users[email] = { name, password };
        localStorage.setItem("users", JSON.stringify(this.users));
        alert("Sign-up successful! Please log in.");
        this.isSignUp = false;
        this.resetForm();
      },
      handleLogin() {
        const { email, password } = this.formData;
  
        const user = this.users[email];
        if (!user || user.password !== password) {
          alert("Invalid credentials.");
          return;
        }
  
        alert(`Welcome back, ${user.name}!`);
        this.resetForm();
      },
    },
  };
  </script>
  
  <style scoped>
  /* Main container */
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f3f4f6, #e0e4f1); /* Soft gradient */
  }
  
  .auth-background {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 80%;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  /* Image section */
  .auth-image-container {
    flex: 1;
    background: url('/images/library1.jpg') center/cover no-repeat;
    height: 100%;
    opacity: 0.8;
  }
  
  /* Form Section */
  .auth-form {
    flex: 1.5;
    background: #ffffff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    max-width: 500px;
  }
  
  .auth-form h1 {
    text-align: center;
    color: #4a4a89;
  }
  
  .auth-form h2 {
    color: #4a4a89;
    margin-bottom: 15px;
  }
  
  .input-field {
    margin-bottom: 15px;
  }
  
  .input-field label {
    font-weight: bold;
    color: #4a4a89;
  }
  
  .input-field input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-top: 5px;
  }
  
  button {
    width: 100%;
    padding: 12px;
    background-color: #4a4a89;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #38387a;
  }
  
  .toggle-text {
    margin-top: 15px;
    text-align: center;
    color: #4a4a89;
    font-size: 0.9rem;
  }
  
  .toggle-text span {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
  </style>
  