import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Catalog from '@/components/Catalogue.vue';
import Auth from '@/components/Auth.vue';


const routes = [
    { path: '/', component: Home},
    { path: '/Catalog', component: Catalog},
    { path: '/Authentification', component: Auth },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
