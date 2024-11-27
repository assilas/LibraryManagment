import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Catalog from '@/components/Catalogue.vue';
import Login from '@/components/LoginForm.vue';
import SignUp from '@/components/SignUp.vue';


const routes = [
    { path: '/', component: Home},
    { path: '/Catalog', component: Catalog},
    { path: '/Login', name: 'Login', component: Login },
    { path: '/Signup', component: SignUp}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
