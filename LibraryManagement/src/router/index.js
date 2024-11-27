import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Catalog from '@/components/Catalogue.vue';
import Login from '@/components/LoginForm.vue';


const routes = [
    { path: '/', component: Home},
    { path: '/Catalog', component: Catalog},
    { path: '/Login', name: 'Login', component: Login },   
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
