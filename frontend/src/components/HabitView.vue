<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api';
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  Calendar as CalendarIcon,
  Flame
} from 'lucide-vue-next';

const props = defineProps(['user']);
const habits = ref([]);
const loading = ref(true);
const newHabitName = ref('');

// Calendar state
const today = new Date();
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1));

const monthYearString = computed(() => {
  return currentMonth.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

const daysInMonth = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const result = [];
  for (let i = 1; i <= days; i++) {
    const d = new Date(year, month, i);
    result.push({
      day: i,
      dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      isToday: d.toDateString() === today.toDateString()
    });
  }
  return result;
});

const fetchHabits = async () => {
  try {
    const res = await api.get(`/habits/${props.user._id}`);
    habits.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('Failed to fetch habits:', err);
  } finally {
    loading.value = false;
  }
};

const createHabit = async () => {
  if (!newHabitName.value.trim()) return;
  try {
    await api.post('/create_habit', {
      name: newHabitName.value,
      userId: props.user._id
    });
    newHabitName.value = '';
    fetchHabits();
  } catch (err) {
    console.error('Failed to create habit:', err);
  }
};

const deleteHabit = async (id) => {
  if (!confirm('Are you sure you want to delete this habit?')) return;
  try {
    await api.delete(`/delete_habit/${id}`);
    fetchHabits();
  } catch (err) {
    console.error('Failed to delete habit:', err);
  }
};

const toggleHabit = async (habitId, dateString) => {
  try {
    await api.post('/toggle_habit', {
      habitId,
      date: dateString,
      userId: props.user._id
    });
    fetchHabits();
  } catch (err) {
    console.error('Failed to toggle habit:', err);
  }
};

const changeMonth = (delta) => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + delta, 1);
};

onMounted(fetchHabits);
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-100 flex items-center gap-3">
        <Flame class="w-8 h-8 text-orange-500" />
        Habit Tracker
      </h1>
      
      <div class="flex items-center gap-4 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
        <button @click="changeMonth(-1)" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <span class="text-sm font-semibold min-w-32 text-center">{{ monthYearString }}</span>
        <button @click="changeMonth(1)" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Quick Add -->
    <section class="max-w-4xl mx-auto glass p-6 rounded-2xl border border-orange-500/20">
      <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Plus class="w-4 h-4" /> Start New Habit
      </h2>
      <form @submit.prevent="createHabit" class="flex gap-4">
        <input 
          v-model="newHabitName"
          type="text" 
          placeholder="What habit do you want to build?"
          class="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-orange-500/50 transition-all"
        >
        <button type="submit" class="bg-orange-600 hover:bg-orange-500 py-2 px-8 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg">
          Add Habit
        </button>
      </form>
    </section>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-slate-400">Loading your habits...</p>
    </div>

    <div v-else class="space-y-6">
      <div v-if="habits.length === 0" class="text-center py-12 glass rounded-2xl border-dashed border-slate-700 max-w-4xl mx-auto">
        <Flame class="w-12 h-12 text-slate-700 mx-auto mb-4" />
        <p class="text-slate-500 italic">No habits tracked yet. Consistency is key!</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="p-4 text-left text-slate-400 font-bold uppercase tracking-wider text-xs sticky left-0 bg-slate-950/80 backdrop-blur-md">Habit</th>
              <th v-for="day in daysInMonth" :key="day.day" class="p-2 text-center min-w-10">
                <div :class="['text-[10px] font-bold transition-colors', day.isToday ? 'text-orange-500' : 'text-slate-600']">
                  {{ day.day }}
                </div>
              </th>
              <th class="p-4"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="habit in habits" :key="habit._id" class="group border-t border-slate-800/50 hover:bg-slate-900/30 transition-colors">
              <td class="p-4 sticky left-0 bg-slate-950/80 backdrop-blur-md">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                  <span class="font-medium text-slate-200">{{ habit.name }}</span>
                </div>
              </td>
              <td v-for="day in daysInMonth" :key="day.day" class="p-1">
                <button 
                  @click="toggleHabit(habit._id, day.dateString)"
                  :class="[
                    'w-8 h-8 rounded-lg mx-auto flex items-center justify-center transition-all duration-200',
                    habit.dates.includes(day.dateString) 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                      : 'bg-slate-800/50 text-slate-600 hover:bg-slate-700 hover:text-slate-300'
                  ]"
                >
                  <CheckCircle2 v-if="habit.dates.includes(day.dateString)" class="w-4 h-4" />
                  <Circle v-else class="w-4 h-4 opacity-20" />
                </button>
              </td>
              <td class="p-4 text-right">
                <button 
                  @click="deleteHabit(habit._id)"
                  class="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
