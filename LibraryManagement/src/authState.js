import Vue from 'vue';

export const authState = Vue.observable({
  isLoggedIn: !!localStorage.getItem('token'),
  userRole: localStorage.getItem('userRole') || null,
});

export const updateAuthState = () => {
  authState.isLoggedIn = !!localStorage.getItem('token');
  authState.userRole = localStorage.getItem('userRole') || null;
};
