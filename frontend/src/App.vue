<script setup>
import { ref, onMounted } from 'vue';
import AuthPage from './components/AuthPage.vue';
import Dashboard from './components/Dashboard.vue';
import api from './api';

const currentView = ref('auth');
const user = ref(null);

const checkAuth = async () => {
  const token = localStorage.getItem('navi_jwt_token');
  const userId = localStorage.getItem('navi_user_id');
  
  if (token && userId) {
    try {
      const res = await api.post('/authenticate', { userId });
      if (res.data.status === 'ok') {
        user.value = res.data.user;
        currentView.value = 'dashboard';
      } else {
        logout();
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      logout();
    }
  }
};

const handleAuthSuccess = (data) => {
  localStorage.setItem('navi_jwt_token', data.data);
  localStorage.setItem('navi_user_id', data.user._id);
  user.value = data.user;
  currentView.value = 'dashboard';
};

const logout = () => {
  localStorage.removeItem('navi_jwt_token');
  localStorage.removeItem('navi_user_id');
  user.value = null;
  currentView.value = 'auth';
};

onMounted(checkAuth);
</script>

<template>
  <div class="min-h-screen">
    <AuthPage v-if="currentView === 'auth'" @success="handleAuthSuccess" />
    <Dashboard v-else-if="currentView === 'dashboard'" :user="user" @logout="logout" />
  </div>
</template>
