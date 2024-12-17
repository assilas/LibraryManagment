import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Catalog from '@/components/Catalogue.vue';
import BookDetails from '../components/BookDetails.vue';
import Cart from "@/components/Cart.vue";
import UserInfo from '@/components/UserInfo.vue';
import Auth from '@/components/Auth.vue';
import MyAccount from '@/components/MyAccount.vue';
import BorrowingRecords from '@/components/BorrowingRecords.vue';
import ManageBooksReturn from '@/components/ManageBooksReturn.vue';
import MembershipManagement from '@/components/MembershipManagement.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/Catalog', component: Catalog },
    { path: '/book/:title', component: BookDetails, name: 'book-details', props: true },
    { path: '/Cart', component: Cart },
    { path: '/VerifyInfo', component: UserInfo},
    { path: '/Authentification', component: Auth },
    { path: '/MyAccount', component: MyAccount },
    { path: '/BorrowingRecords', component: BorrowingRecords },
    { path: '/ManageBooksReturn', component: ManageBooksReturn },
    { path: '/MembershipManagement', component: MembershipManagement },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
