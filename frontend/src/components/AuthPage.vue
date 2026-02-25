<script setup>
import { ref } from 'vue';
import api from '../api';
import { User, Lock, Mail, ArrowRight } from 'lucide-vue-next';

const emit = defineEmits(['success']);

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  const endpoint = isLogin.value ? '/login' : '/signup';
  
  try {
    const res = await api.post(endpoint, {
      email: email.value,
      password: password.value
    });
    
    if (res.data.status === 'ok') {
      emit('success', res.data);
    } else {
      error.value = res.data.data || res.data.error || 'Authentication failed';
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Connection error';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center p-4 overflow-hidden bg-slate-950">
    <!-- Decorative background blobs -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>

    <div class="w-full max-w-md glass p-8 rounded-2xl relative z-10 animate-float">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gradient mb-2">Navi</h1>
        <p class="text-slate-400">{{ isLogin ? 'Welcome back to your workspace' : 'Start your productivity journey' }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-300 ml-1">Email Address</label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              v-model="email"
              type="email" 
              required
              placeholder="name@example.com"
              class="w-full input-field pl-11"
            >
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-300 ml-1">Password</label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              v-model="password"
              type="password" 
              required
              placeholder="••••••••"
              class="w-full input-field pl-11"
            >
          </div>
        </div>

        <div v-if="error" class="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full btn-primary flex items-center justify-center gap-2 group"
        >
          {{ loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account') }}
          <ArrowRight v-if="!loading" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div class="mt-8 text-center text-slate-400 text-sm">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <button 
          @click="isLogin = !isLogin"
          class="text-blue-400 hover:text-blue-300 font-semibold ml-1 transition-colors"
        >
          {{ isLogin ? 'Sign Up' : 'Log In' }}
        </button>
      </div>
    </div>
  </div>
</template>
