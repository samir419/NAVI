<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import { Plus, Trash2, Calendar, Clock, CheckCircle2, Circle, List as ListIcon, Calendar as CalendarIcon } from 'lucide-vue-next';
import CalendarView from './CalendarView.vue';

const props = defineProps(['user']);
const todos = ref([]);
const loading = ref(true);
const viewMode = ref('list'); // 'list' or 'calendar'

const newTodo = ref({
  description: '',
  start_date: new Date().toISOString().split('T')[0],
  dead_line: new Date(Date.now() + 86400000).toISOString().split('T')[0]
});

const fetchTodos = async () => {
  try {
    const res = await api.get(`/todos/${props.user._id}`);
    todos.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('Failed to fetch todos:', err);
  } finally {
    loading.value = false;
  }
};

const createTodo = async () => {
  if (!newTodo.value.description) return;
  try {
    await api.post('/create_todo', {
      ...newTodo.value,
      userId: props.user._id
    });
    newTodo.value.description = '';
    fetchTodos();
  } catch (err) {
    console.error('Failed to create todo:', err);
  }
};

const deleteTodo = async (id) => {
  try {
    await api.delete(`/delete_todo/${id}`);
    fetchTodos();
  } catch (err) {
    console.error('Failed to delete todo:', err);
  }
};

onMounted(fetchTodos);
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-100">Tasks</h1>
      <div class="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
        <button 
          @click="viewMode = 'list'"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
            viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          ]"
        >
          <ListIcon class="w-4 h-4" /> List
        </button>
        <button 
          @click="viewMode = 'calendar'"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
            viewMode === 'calendar' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          ]"
        >
          <CalendarIcon class="w-4 h-4" /> Calendar
        </button>
      </div>
    </div>

    <!-- Quick Add -->
    <section class="max-w-4xl mx-auto glass p-6 rounded-2xl border border-blue-500/20">
      <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Plus class="w-4 h-4" /> Quick Add Task
      </h2>
      <form @submit.prevent="createTodo" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <input 
            v-model="newTodo.description"
            type="text" 
            placeholder="What needs to be done?"
            class="w-full input-field"
          >
        </div>
        <div>
          <input 
            v-model="newTodo.start_date"
            type="date" 
            class="w-full input-field"
          >
        </div>
        <div>
          <button type="submit" class="w-full btn-primary py-2 h-full">Add Task</button>
        </div>
      </form>
    </section>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-slate-400">Loading your tasks...</p>
    </div>

    <template v-else>
      <Transition 
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        mode="out-in"
      >
        <div v-if="viewMode === 'list'" key="list" class="max-w-4xl mx-auto space-y-4">
          <div v-if="todos.length === 0" class="text-center py-12 glass rounded-2xl border-dashed border-slate-700">
            <CheckSquare class="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p class="text-slate-500 italic">All caught up! Time to relax or start something new.</p>
          </div>

          <div 
            v-for="todo in todos" 
            :key="todo._id"
            class="glass group p-4 rounded-xl flex items-center justify-between hover:border-slate-600 transition-all"
          >
            <div class="flex items-center gap-4 flex-1">
              <button class="text-slate-600 hover:text-blue-500 transition-colors">
                <Circle class="w-6 h-6" />
              </button>
              <div class="min-w-0">
                <h3 class="font-medium text-slate-200 truncate">{{ todo.description }}</h3>
                <div class="flex items-center gap-4 mt-1 text-xs text-slate-500">
                  <span class="flex items-center gap-1"><Calendar class="w-3 h-3" /> {{ todo.start }}</span>
                  <span class="flex items-center gap-1 text-red-400/80"><Clock class="w-3 h-3" /> Due: {{ todo.end }}</span>
                </div>
              </div>
            </div>
            
            <button 
              @click="deleteTodo(todo._id)"
              class="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>

        <CalendarView v-else key="calendar" :todos="todos" />
      </Transition>
    </template>
  </div>
</template>
