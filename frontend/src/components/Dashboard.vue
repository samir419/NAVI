<script setup>
import { ref } from 'vue';
import { 
  CheckSquare, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X,
  Flame
} from 'lucide-vue-next';
import TodoView from './TodoView.vue';
import NoteView from './NoteView.vue';
import ChatWindow from './ChatWindow.vue';
import HabitView from './HabitView.vue';

const props = defineProps(['user']);
const emit = defineEmits(['logout']);

const activeTab = ref('todos');
const isSidebarOpen = ref(true);

const navItems = [
  { id: 'todos', name: 'Tasks', icon: CheckSquare },
  { id: 'habits', name: 'Habits', icon: Flame },
  { id: 'notes', name: 'Notes', icon: FileText },
  { id: 'chat', name: 'Navi AI', icon: MessageSquare },
];

const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value;
</script>

<template>
  <div class="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
    <!-- Sidebar -->
    <aside 
      :class="[
        'glass h-full transition-all duration-300 z-20 flex flex-col',
        isSidebarOpen ? 'w-64' : 'w-20'
      ]"
    >
      <div class="p-6 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
          <span class="font-bold text-white">N</span>
        </div>
        <h2 v-if="isSidebarOpen" class="text-xl font-bold text-gradient">Navi</h2>
      </div>

      <nav class="flex-1 px-4 space-y-2 mt-4">
        <button 
          v-for="item in navItems" 
          :key="item.id"
          @click="activeTab = item.id"
          :class="[
            'w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group',
            activeTab === item.id 
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
          ]"
        >
          <component :is="item.icon" :class="['w-5 h-5 shrink-0', activeTab === item.id ? 'animate-pulse' : '']" />
          <span v-if="isSidebarOpen" class="font-medium">{{ item.name }}</span>
          <div v-if="!isSidebarOpen" class="absolute left-full ml-4 px-2 py-1 bg-slate-800 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
            {{ item.name }}
          </div>
        </button>
      </nav>

      <div class="p-4 border-t border-slate-800/50 space-y-2">
        <div v-if="isSidebarOpen" class="px-4 py-2 flex items-center gap-3 mb-2">
          <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 overflow-hidden">
            <img v-if="user?.profile_pic" :src="user.profile_pic" class="w-full h-full object-cover">
            <span v-else class="text-xs uppercase">{{ user?.email?.[0] || 'U' }}</span>
          </div>
          <div class="min-w-0">
            <p class="text-xs font-semibold truncate">{{ user?.email }}</p>
            <p class="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Pro Member</p>
          </div>
        </div>

        <button 
          @click="emit('logout')"
          class="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut class="w-5 h-5 shrink-0" />
          <span v-if="isSidebarOpen" class="font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col relative overflow-hidden">
      <!-- Background elements -->
      <div class="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
      
      <header class="h-16 flex items-center justify-between px-8 border-b border-slate-800/50 backdrop-blur-sm relative z-10">
        <div class="flex items-center gap-4">
          <button @click="toggleSidebar" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
            <Menu v-if="!isSidebarOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
          <h1 class="text-lg font-semibold flex items-center gap-2">
            {{ navItems.find(i => i.id === activeTab)?.name }}
          </h1>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-8 relative z-10">
        <Transition 
          enter-active-class="transform transition ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transform transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
          mode="out-in"
        >
          <component 
            :is="activeTab === 'todos' ? TodoView : (activeTab === 'habits' ? HabitView : (activeTab === 'notes' ? NoteView : ChatWindow))" 
            :key="activeTab"
            :user="user"
          />
        </Transition>
      </div>
    </main>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
