<script setup>
import { ref, computed } from 'vue';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-vue-next';

const props = defineProps(['todos']);

const currentDate = ref(new Date());

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return new Date(year, month + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return new Date(year, month, 1).getDay();
});

const monthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

const calendarDays = computed(() => {
  const days = [];
  const prevMonthLastDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 0).getDate();
  
  // Padding from previous month
  for (let i = firstDayOfMonth.value - 1; i >= 0; i--) {
    days.push({ day: prevMonthLastDay - i, currentMonth: false });
  }
  
  // Current month
  for (let i = 1; i <= daysInMonth.value; i++) {
    days.push({ day: i, currentMonth: true });
  }
  
  // Padding for next month
  const totalSlots = 42; // 6 rows of 7 days
  const remainingSlots = totalSlots - days.length;
  for (let i = 1; i <= remainingSlots; i++) {
    days.push({ day: i, currentMonth: false });
  }
  
  return days;
});

const getTodosForDay = (day, isCurrentMonth) => {
  if (!isCurrentMonth) return [];
  const dateStr = `${currentDate.value.getFullYear()}-${String(currentDate.value.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return props.todos.filter(t => t.start === dateStr);
};

const changeMonth = (delta) => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + delta, 1);
};

const isToday = (day, isCurrentMonth) => {
  const today = new Date();
  return isCurrentMonth && 
         day === today.getDate() && 
         currentDate.value.getMonth() === today.getMonth() && 
         currentDate.value.getFullYear() === today.getFullYear();
};
</script>

<template>
  <div class="glass rounded-2xl p-6 border border-blue-500/20">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-xl font-bold text-slate-100 flex items-center gap-3">
        <CalendarIcon class="w-6 h-6 text-blue-400" />
        {{ monthName }}
      </h2>
      <div class="flex gap-2">
        <button @click="changeMonth(-1)" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 border border-slate-700 transition-colors">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <button @click="changeMonth(1)" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 border border-slate-700 transition-colors">
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-px bg-slate-800/50 rounded-xl overflow-hidden border border-slate-800">
      <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="p-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-900/50">
        {{ day }}
      </div>
      
      <div 
        v-for="(date, idx) in calendarDays" 
        :key="idx"
        :class="[
          'min-h-[120px] p-2 transition-all group relative',
          date.currentMonth ? 'bg-slate-900/20' : 'bg-slate-950/40 opacity-30 select-none pointer-events-none'
        ]"
      >
        <div class="flex items-center justify-between mb-2">
          <span 
            :class="[
              'text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors',
              isToday(date.day, date.currentMonth) ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400'
            ]"
          >
            {{ date.day }}
          </span>
        </div>

        <div class="space-y-1">
          <div 
            v-for="todo in getTodosForDay(date.day, date.currentMonth)" 
            :key="todo._id"
            class="text-[10px] p-1.5 rounded-md bg-blue-600/20 border border-blue-500/30 text-blue-200 truncate cursor-default hover:bg-blue-600/30 transition-colors"
            :title="todo.description"
          >
            {{ todo.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(16px);
}
</style>
