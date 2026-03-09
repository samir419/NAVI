<script setup>
import { ref, onMounted, nextTick } from 'vue'
import api from '../api'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-vue-next'

const props = defineProps(['user'])

const messages = ref([
  { role: 'assistant', content: "Hello! I'm Navi, your productivity assistant. How can I help you today?" }
])

const input = ref('')
const loading = ref(false)
const chatContainer = ref(null)

const context_data = ref({
  todos: [],
  habits: [],
  notes: []
})

const mock_response =  `
📊 Productivity Overview

Here's a summary of your current activity:

📋 Upcoming Tasks
- Fix code bug — scheduled for Mar 10, 2026
- Team meeting — scheduled for Mar 11, 2026

You currently have 2 upcoming tasks. The bug fix appears to be the most immediate priority.

🔥 Habit Progress
- Gym — completed 3 times (Mar 9, Mar 10, Mar 13)
- Reading — completed 2 times (Mar 9, Mar 12)

Your gym habit shows good consistency. Your reading habit is progressing but could benefit from more regular sessions.

📝 Notes
- Meeting notes
  - Research new AI technology
  - Review HR department notes

These notes suggest preparation for discussions related to AI and internal coordination.

🎯 Suggested Focus
1. Resolve the code bug before the upcoming meeting.
2. Continue your gym habit streak.
3. Schedule another reading session soon to maintain momentum.
4. Review your meeting notes before the team meeting.
`;

/* ---------------- COMMAND BUTTONS ---------------- */

const commands = [
  { label: "📋 Summarize Tasks", prompt: "Summarize my tasks and habits." },
  { label: "🎯 What should I do today?", prompt: "What should I focus on today?" },
  { label: "🔥 Habit progress", prompt: "How am I doing with my habits?" },
  { label: "📝 Review notes", prompt: "Summarize my important notes." }
]

const runCommand = async (prompt) => {
  input.value = prompt
  await sendMessage()
}

/* ---------------- FETCH USER DATA ---------------- */

const getContext = async () => {
  try {
    let res = await api.get(`/todos/${props.user._id}`)
    const todos = Array.isArray(res.data) ? res.data : []

    res = await api.get(`/habits/${props.user._id}`)
    const habits = Array.isArray(res.data) ? res.data : []

    res = await api.get(`/notes/${props.user._id}`)
    const notes = Array.isArray(res.data) ? res.data : []

    context_data.value = { todos, habits, notes }

  } catch (err) {
    console.error('Failed to fetch context data:', err)
  }
}

/* ---------------- FORMAT CONTEXT ---------------- */

const formatDate = (d) => {
  return new Date(d).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })
}

const formatContext = (data) => {

  const todos = data.todos.length
    ? data.todos.map((t,i)=>
` ${i+1}. ${t.description}
   Start: ${formatDate(t.start)}
   Due: ${formatDate(t.end)}`).join("\n\n")
    : "None"

  const habits = data.habits.length
    ? data.habits.map((h,i)=>
` ${i+1}. ${h.name}
   Completed: ${h.dates.length} days
   Dates: ${h.dates.map(d=>formatDate(d)).join(", ")}`).join("\n\n")
    : "None"

  const notes = data.notes.length
    ? data.notes.map((n,i)=>
` ${i+1}. ${n.title}
${n.body}`).join("\n\n")
    : "None"

  return `
USER PRODUCTIVITY DATA

📋 TODOS
${todos}

🔥 HABITS
${habits}

📝 NOTES
${notes}
`
}

/* ---------------- CONTEXT SUMMARY ---------------- */

const summarizeContext = (data) => {

  return {
    todoCount: data.todos.length,

    upcomingTodos: data.todos.map(t => ({
      task: t.description,
      due: t.end
    })),

    habits: data.habits.map(h => ({
      name: h.name,
      completions: h.dates.length,
      lastCompleted: h.dates[h.dates.length-1] || null
    })),

    notes: data.notes.map(n => n.title)
  }
}

/* ---------------- SCROLL ---------------- */

const scrollToBottom = async () => {
  await nextTick()
  if(chatContainer.value){
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

/* ---------------- SEND MESSAGE ---------------- */

const sendMessage = async () => {

  if(!input.value.trim() || loading.value) return

  const userMessage = input.value
  messages.value.push({ role:'user', content:userMessage })

  input.value=''
  loading.value=true

  await scrollToBottom()

  try{

    const res = await api.get('/get_api_key')
    const hfToken = res.data.api_key

    if(!hfToken){
      messages.value.push({
        role:'assistant',
        content:"Missing API key."
      })
      return
    }

    const contextText = formatContext(context_data.value)
    const summary = summarizeContext(context_data.value)

    const aiRes = await fetch('https://router.huggingface.co/v1/chat/completions',{
      method:'POST',
      headers:{
        Authorization:`Bearer ${hfToken}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({

        model:"deepseek-ai/DeepSeek-V3",

        messages:[
          {
            role:"system",
            content:`You are Navi, a productivity assistant.

Here is a summary of the user's productivity data:
${JSON.stringify(summary,null,2)}

Detailed context:
${contextText}

Help the user manage productivity and focus on priorities.`
          },

          ...messages.value
        ]

      })
    })

    const data = await aiRes.json()

    if(aiRes.ok){
      messages.value.push({
        role:'assistant',
        content:data.choices[0].message.content
      })
    } else {
      throw new Error(data.error?.message)
    }

  }catch(err){

    console.error(err)

    messages.value.push({
      role:'assistant',
      content:mock_response
    })

  }finally{

    loading.value=false
    await scrollToBottom()

  }

}

/* ---------------- INIT ---------------- */

onMounted(async()=>{
  await getContext()
  await scrollToBottom()
})
</script>

<template>

<div class="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">

<!-- HEADER -->

<div class="glass p-4 rounded-t-2xl border-b border-blue-500/20 flex items-center gap-3">

<div class="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
<Sparkles class="w-6 h-6 text-blue-400"/>
</div>

<div>
<h2 class="font-bold text-slate-100">Navi AI Assistant</h2>
<p class="text-[10px] text-blue-400 uppercase tracking-widest">Powered by DeepSeek</p>
</div>

</div>

<!-- MESSAGES -->

<div ref="chatContainer"
class="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/30 scrollbar-hide">

<div v-for="(msg,idx) in messages" :key="idx"
:class="['flex gap-4', msg.role==='user' ? 'flex-row-reverse':'' ]">

<div :class="[
'w-8 h-8 rounded-lg flex items-center justify-center border',
msg.role==='user' ? 'bg-slate-800 border-slate-700'
:'bg-blue-600/20 border-blue-500/30'
]">

<User v-if="msg.role==='user'" class="w-5 h-5 text-slate-400"/>
<Bot v-else class="w-5 h-5 text-blue-400"/>

</div>

<div :class="[
'max-w-[80%] p-4 rounded-2xl text-sm whitespace-pre-line',
msg.role==='user'
?'bg-blue-600 text-white rounded-tr-none'
:'glass text-slate-200 rounded-tl-none'
]">

{{ msg.content }}

</div>

</div>

<div v-if="loading" class="flex gap-4">

<div class="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
<Loader2 class="w-5 h-5 text-blue-400 animate-spin"/>
</div>

<div class="glass p-4 rounded-2xl text-slate-400 italic">
Thinking...
</div>

</div>

</div>

<!-- INPUT -->

<div class="glass p-4 rounded-b-2xl border-t border-blue-500/20">

<!-- COMMAND BUTTONS -->

<div class="flex flex-wrap gap-2 mb-3">

<button v-for="cmd in commands"
:key="cmd.label"
@click="runCommand(cmd.prompt)"
class="px-3 py-1 text-xs rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30">

{{cmd.label}}

</button>

</div>

<form @submit.prevent="sendMessage" class="flex gap-4">

<input
v-model="input"
type="text"
placeholder="Ask Navi anything..."
class="flex-1 input-field"
:disabled="loading"
/>

<button
type="submit"
:disabled="loading || !input.trim()"
class="btn-primary px-4 py-2">

<Send class="w-5 h-5"/>

</button>

</form>

</div>

</div>

</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar{display:none}
.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
</style>