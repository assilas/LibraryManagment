<template>
    <form @submit.prevent="handleLogin">
        <input v-model="username" placeholder="Username" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <select v-model="role">
            <option value="member">Member</option>
            <option value="librarian">Librarian</option>
        </select>
        <button type="submit">Login</button>
    </form>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: '',
            role: 'member',
        };
    },
    methods: {
        handleLogin() {
            axios
                .post('http://localhost:3000/auth/login', {
                    username: this.username,
                    password: this.password,
                    role: this.role,
                })
                .then((response) => {
                    alert(`Welcome, ${this.role}!`);
                    localStorage.setItem('token', response.data.token);
                })
                .catch(() => alert('Invalid credentials'));
        },
    },
};
</script>
