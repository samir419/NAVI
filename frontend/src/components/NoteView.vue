<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import { Plus, Trash2, Eye, Calendar, FileText, Search } from 'lucide-vue-next';

const props = defineProps(['user']);
const notes = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedNote = ref(null);
const isEditing = ref(false);
const editableNote = ref({ title: '', body: '' });

const newNote = ref({
  title: '',
  body: ''
});

const fetchNotes = async () => {
  try {
    const res = await api.get(`/notes/${props.user._id}`);
    notes.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('Failed to fetch notes:', err);
  } finally {
    loading.value = false;
  }
};

const createNote = async () => {
  if (!newNote.value.title || !newNote.value.body) return;
  try {
    await api.post('/create_note', {
      ...newNote.value,
      userId: props.user._id
    });
    newNote.value = { title: '', body: '' };
    fetchNotes();
  } catch (err) {
    console.error('Failed to create note:', err);
  }
};

const deleteNote = async (id) => {
  if (!confirm('Are you sure you want to delete this note?')) return;
  try {
    await api.delete(`/delete_note/${id}`);
    fetchNotes();
    if (selectedNote.value?._id === id) selectedNote.value = null;
  } catch (err) {
    console.error('Failed to delete note:', err);
  }
};

const openNote = (note) => {
  selectedNote.value = note;
  isEditing.value = false;
  editableNote.value = { title: note.title, body: note.body };
};

const startEditing = () => {
  isEditing.value = true;
};

const saveEdit = async () => {
  try {
    await api.put(`/update_note/${selectedNote.value._id}`, {
      title: editableNote.value.title,
      body: editableNote.value.body
    });
    selectedNote.value.title = editableNote.value.title;
    selectedNote.value.body = editableNote.value.body;
    isEditing.value = false;
    fetchNotes();
  } catch (err) {
    console.error('Failed to update note:', err);
  }
};

onMounted(fetchNotes);
</script>

<template>
  <div class="max-w-6xl mx-auto flex flex-col h-full space-y-8">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left: Create Note -->
      <section class="md:w-1/3 glass p-6 rounded-2xl h-fit border border-emerald-500/20">
        <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FileText class="w-4 h-4" /> New Note
        </h2>
        <form @submit.prevent="createNote" class="space-y-4">
          <input 
            v-model="newNote.title"
            type="text" 
            placeholder="Note Title"
            class="w-full input-field"
          >
          <textarea 
            v-model="newNote.body"
            placeholder="Start writing..."
            rows="8"
            class="w-full input-field resize-none"
          ></textarea>
          <button type="submit" class="w-full btn-primary bg-gradient-to-r from-emerald-500 to-teal-600">
            Save Note
          </button>
        </form>
      </section>

      <!-- Right: Note Grid -->
      <div class="flex-1 space-y-6">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search notes..."
            class="w-full input-field pl-10"
          >
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-left">
          <div 
            v-for="note in notes" 
            :key="note._id"
            @click="openNote(note)"
            class="glass group p-5 rounded-xl border border-transparent hover:border-emerald-500/30 transition-all cursor-pointer relative"
          >
            <h3 class="font-bold text-slate-100 mb-2 truncate pr-8">{{ note.title }}</h3>
            <p class="text-sm text-slate-400 line-clamp-3 mb-4">{{ note.body }}</p>
            <div class="flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span class="flex items-center gap-1 uppercase tracking-tighter"><Calendar class="w-3 h-3" /> {{ new Date(note.created_at).toLocaleDateString() }}</span>
              <div class="flex gap-2">
                <button @click.stop="deleteNote(note._id)" class="text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Note Overlay -->
    <Transition name="fade">
      <div v-if="selectedNote" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" @click="selectedNote = null">
        <div class="w-full max-w-2xl glass rounded-2xl p-8 max-h-[80vh] overflow-y-auto" @click.stop>
          <div class="flex justify-between items-start mb-6">
            <template v-if="isEditing">
              <input 
                v-model="editableNote.title"
                class="text-3xl font-bold bg-transparent border-b border-emerald-500/50 focus:outline-none w-full mr-4 text-slate-100"
                placeholder="Title"
              >
            </template>
            <h2 v-else class="text-3xl font-bold text-slate-100">{{ selectedNote.title }}</h2>
            <button @click="selectedNote = null" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 shrink-0">
              <Plus class="w-6 h-6 rotate-45" />
            </button>
          </div>
          
          <template v-if="isEditing">
            <textarea 
              v-model="editableNote.body"
              class="w-full bg-slate-800/50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 min-h-[300px] resize-y"
              placeholder="Start writing..."
            ></textarea>
            <div class="mt-6 flex gap-4">
              <button @click="saveEdit" class="btn-primary bg-gradient-to-r from-emerald-500 to-teal-600 px-6">Save Changes</button>
              <button @click="isEditing = false" class="text-slate-400 hover:text-slate-200 font-medium">Cancel</button>
            </div>
          </template>
          <template v-else>
            <div class="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
              {{ selectedNote.body }}
            </div>
            <div class="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
              <span>Created: {{ new Date(selectedNote.created_at).toLocaleString() }}</span>
              <div class="flex gap-4">
                <button @click="startEditing" class="text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider">Edit Note</button>
                <button @click="deleteNote(selectedNote._id)" class="text-red-400 hover:text-red-300 font-bold uppercase tracking-wider">Delete Note</button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
