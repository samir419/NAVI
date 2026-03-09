<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from '../api';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-vue-next';

const props = defineProps(['user']);
const messages = ref([
  { role: 'assistant', content: "Hello! I'm Navi, your productivity assistant. How can I help you today?" }
]);
const input = ref('');
const loading = ref(false);
const chatContainer = ref(null);
const context_data = ref({})

const commands = [
  {
    label: "📋 Summarize Tasks",
    prompt: "Summarize my todos, habits, and notes and tell me what I should focus on."
  },
  {
    label: "🎯 What Should I Do Today",
    prompt: "Based on my tasks and habits, what should I prioritize today?"
  },
  {
    label: "🔥 Habit Progress",
    prompt: "Analyze my habits and tell me how I'm doing."
  },
  {
    label: "📝 Recent Notes",
    prompt: "Summarize the important ideas from my notes."
  }
];

const runCommand = async (prompt) => {
  input.value = prompt;
  await sendMessage();
};

const getContext = async () => {
  try {
    let res = await api.get(`/todos/${props.user._id}`);
    let todos = Array.isArray(res.data) ? res.data : [];

    res = await api.get(`/habits/${props.user._id}`);
    let habits = Array.isArray(res.data) ? res.data : [];

    res = await api.get(`/notes/${props.user._id}`);
    let notes = Array.isArray(res.data) ? res.data : [];

    context_data.value = {
      todos,
      habits,
      notes
    };
    console.log('getting context data')
    console.log(context_data);
  } catch (err) {
    console.error('Failed to fetch context data:', err);
  }
};

function summarizeContext(data) {

  return {
    todoCount: data.todos.length,

    upcomingTodos: data.todos.map(t => ({
      task: t.description,
      due: t.end
    })),

    habits: data.habits.map(h => ({
      name: h.name,
      totalCompletions: h.dates.length,
      lastCompleted: h.dates[h.dates.length - 1] || null
    })),

    noteTitles: data.notes.map(n => n.title)
  };

}

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
  await getContext()
   messages.value.push({ 
        role: 'system', 
         content: `context user data: ${JSON.stringify(context_data.value)}` 
      });
};

const sendMessage = async () => {
  if (!input.value.trim() || loading.value) return;

  const userMessage = input.value;
  messages.value.push({ role: 'user', content: userMessage });
  input.value = '';
  loading.value = true;
  await scrollToBottom();

  try {
    // In a real app, we'd fetch todos/notes context too as seen in the prototype
    const res = await api.get('/get_api_key');
    const hfToken = res.data.api_key;

    if (!hfToken) {
      messages.value.push({ 
        role: 'assistant', 
        content: "I couldn't find an API key. Please configure the HF_API_KEY on the server to enable AI chat." 
      });
      return;
    }

    const aiRes = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3", // Using the one from prototype context
        messages: messages.value.map(m => ({ role: m.role, content: m.content }))
      })
    });

    const data = await aiRes.json();
    if (aiRes.ok) {
      messages.value.push({ role: 'assistant', content: data.choices[0].message.content });
    } else {
      throw new Error(data.error?.message || 'AI request failed');
    }
  } catch (err) {
    console.error('Chat error:', err);
    messages.value.push({ 
      role: 'assistant', 
      content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." 
    });
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
};

onMounted(scrollToBottom);
</script>

<template>
  <div class="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
    <!-- Chat Header -->
    <div class="glass p-4 rounded-t-2xl border-b border-blue-500/20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
          <Sparkles class="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 class="font-bold text-slate-100">Navi AI Assistant</h2>
          <p class="text-[10px] text-blue-400 uppercase font-bold tracking-widest">Powered by DeepSeek</p>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div 
      ref="chatContainer"
      class="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/30 scrollbar-hide"
    >
      <div 
        v-for="(msg, idx) in messages" 
        :key="idx"
        :class="['flex gap-4', msg.role === 'user' ? 'flex-row-reverse' : '']"
      >
        <div 
          :class="[
            'w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border',
            msg.role === 'user' ? 'bg-slate-800 border-slate-700' : 'bg-blue-600/20 border-blue-500/30'
          ]"
        >
          <User v-if="msg.role === 'user'" class="w-5 h-5 text-slate-400" />
          <Bot v-else class="w-5 h-5 text-blue-400" />
        </div>
        
        <div 
          :class="[
            'max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed text-left',
            msg.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'glass text-slate-200 rounded-tl-none'
          ]"
        >
          {{ msg.content }}
        </div>
      </div>

      <div v-if="loading" class="flex gap-4">
        <div class="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
          <Loader2 class="w-5 h-5 text-blue-400 animate-spin" />
        </div>
        <div class="glass p-4 rounded-2xl rounded-tl-none text-sm text-slate-400 italic">
          Thinking...
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="glass p-4 rounded-b-2xl border-t border-blue-500/20">
      <!-- Command Buttons -->
      <div class="flex flex-wrap gap-2 mb-3">
        <button
          v-for="cmd in commands"
          :key="cmd.label"
          @click="runCommand(cmd.prompt)"
          class="px-3 py-1 text-xs rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition"
        >
          {{ cmd.label }}
        </button>
      </div>
      <form @submit.prevent="sendMessage" class="flex gap-4">
        <input 
          v-model="input"
          type="text" 
          placeholder="Ask Navi anything..."
          class="flex-1 input-field"
          :disabled="loading"
        >
        <button 
          type="submit" 
          :disabled="loading || !input.trim()"
          class="btn-primary px-4 py-2 disabled:opacity-50 disabled:scale-100"
        >
          <Send class="w-5 h-5" />
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>

