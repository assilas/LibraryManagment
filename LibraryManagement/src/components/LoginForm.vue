<template>
  <div :class="`login-container ${role}`">
    <h1>Library Management </h1>
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

    <form @submit.prevent="handleSubmit">
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
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      role: "librarian", // Default role
      formData: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    setRole(selectedRole) {
      this.role = selectedRole;
    },
    handleSubmit() {
      alert(
        `Logging in as ${this.role.toUpperCase()} with email: ${this.formData.email}`
      );
      // Add API call logic here
    },
  },
};
</script>

<style scoped>
/* Container styles based on role */
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

/* Title styles */
h1 {
  color: #333;
  margin-bottom: 20px;
}

/* Role switch buttons */
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
  background: #8a2be2; /* Default librarian active color */
  color: white;
}

.role-switch .active:nth-child(2) {
  background: #ff69b4; /* Member active color */
}

/* Form styles */
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
  background: #8a2be2; /* Default librarian button */
  color: white;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background: #6a1cb3;
}

/* Member button hover state */
.login-container.member button {
  background: #ff69b4;
}

.login-container.member button:hover {
  background: #e05493;
}
</style>
