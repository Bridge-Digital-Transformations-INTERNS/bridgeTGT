# BridgeTGT — Vue 3 + Vite + Pinia + Tailwind starter (category filter, inline status editing, improved dropdown)

This update adds:
- **Category filter** in TaskTable (with "All Categories" default).
- **Inline editable status dropdown** in the tasks table.
- Improved **Projects dropdown styling**: professional look, hover highlight with lime, and closes when clicking outside or after selecting.

---

### src/components/HeaderBar.vue (improved project dropdown)
```vue
<template>
  <header class="flex items-center justify-between p-4 bg-white shadow-md">
    <div class="flex items-center gap-3">
      <img src="/src/assets/logo.svg" alt="BridgeTGT" class="w-10 h-10" />
      <h1 class="text-xl font-bold">BridgeTGT</h1>
    </div>

    <div class="flex items-center gap-3 relative">
      <button @click="openProjectModal(false)" class="px-3 py-2 rounded bg-slate-100">+ Add Project</button>
      <button @click="openTaskModal(false)" class="px-3 py-2 rounded bg-slate-100">+ Add Task</button>

      <!-- Project dropdown -->
      <div class="relative" ref="dropdownRef">
        <button @click="toggleDropdown" class="px-3 py-2 border rounded flex items-center gap-1">
          Projects <span>▼</span>
        </button>
        <div v-if="showDropdown" class="absolute right-0 mt-2 bg-white border rounded shadow-md w-64 z-20">
          <ul>
            <li v-for="p in store.projects" :key="p.id"
                class="px-3 py-2 hover:bg-[var(--color-lime)] hover:text-black flex justify-between items-center group cursor-pointer"
                @click="selectProject(p)">
              <span>{{ p.name }}</span>
              <div class="opacity-0 group-hover:opacity-100 flex gap-1">
                <button @click.stop="openProjectModal(true, p)" class="text-xs px-2 py-1 bg-blue-100 rounded">Edit</button>
                <button @click.stop="askDelete(p)" class="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">Del</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ProjectModal :open="showProjectModal" :isEdit="projectIsEdit" :initial="editingProject" @close="closeProjectModal" @save="saveProject" />
    <TaskModal :open="showTaskModal" :isEdit="taskIsEdit" :initial="editingTask" @close="closeTaskModal" @save="saveTask" />
    <ConfirmModal :open="showConfirm" title="Delete Project" message="Are you sure you want to delete this project?" @cancel="closeConfirm" @confirm="deleteProject" />
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useProjectStore } from '../stores/projectStore'
import ProjectModal from './ProjectModal.vue'
import TaskModal from './TaskModal.vue'
import ConfirmModal from './ConfirmModal.vue'

const store = useProjectStore()

const showDropdown = ref(false)
const dropdownRef = ref(null)

function toggleDropdown() { showDropdown.value = !showDropdown.value }
function selectProject(p) { store.selectedProjectId = p.id; showDropdown.value = false }

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) showDropdown.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

// Project modal state
const showProjectModal = ref(false)
const projectIsEdit = ref(false)
const editingProject = ref(null)

function openProjectModal(isEdit, project = null) {
  projectIsEdit.value = isEdit
  editingProject.value = project
  showProjectModal.value = true
}
function closeProjectModal() { showProjectModal.value = false }
function saveProject(data) {
  if (projectIsEdit.value && editingProject.value) {
    editingProject.value.name = data.name
  } else {
    store.addProject(data.name)
  }
  closeProjectModal()
}

// Task modal state
const showTaskModal = ref(false)
const taskIsEdit = ref(false)
const editingTask = ref(null)

function openTaskModal(isEdit, task = null) {
  taskIsEdit.value = isEdit
  editingTask.value = task
  showTaskModal.value = true
}
function closeTaskModal() { showTaskModal.value = false }
function saveTask(data) {
  if (taskIsEdit.value && editingTask.value) {
    store.updateTask(store.selectedProjectId, editingTask.value.id, data)
  } else {
    store.addTask(store.selectedProjectId, data)
  }
  closeTaskModal()
}

// Delete confirm
const showConfirm = ref(false)
const projectToDelete = ref(null)
function askDelete(p) { projectToDelete.value = p; showConfirm.value = true }
function closeConfirm() { showConfirm.value = false; projectToDelete.value = null }
function deleteProject() {
  if (projectToDelete.value) store.deleteProject(projectToDelete.value.id)
  closeConfirm()
}
</script>
```

---

### src/components/TasksTable.vue (category filter + inline status edit)
```vue
<template>
  <div class="mt-6 bg-white p-4 rounded-2xl shadow">
    <div class="flex gap-3 items-center mb-4">
      <input v-model="q" placeholder="Search tasks..." class="p-2 border rounded flex-1" />
      <select v-model="categoryFilter" class="p-2 border rounded">
        <option value="">All Categories</option>
        <option v-for="c in categories" :key="c">{{ c }}</option>
      </select>
      <select v-model="statusFilter" class="p-2 border rounded">
        <option value="">All Status</option>
        <option value="completed">Completed</option>
        <option value="inprogress">In Progress</option>
        <option value="pending">Pending</option>
      </select>
    </div>

    <table class="w-full table-auto">
      <thead>
        <tr class="text-left text-sm text-slate-600">
          <th class="p-2">Task</th>
          <th class="p-2">Phase</th>
          <th class="p-2">Category</th>
          <th class="p-2">Status</th>
          <th class="p-2">Assignee</th>
          <th class="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in paged" :key="t.id" class="border-t">
          <td class="p-2">{{ t.title }}</td>
          <td class="p-2">{{ t.phase }}</td>
          <td class="p-2">{{ t.category || '—' }}</td>
          <td class="p-2">
            <select v-model="t.status" @change="updateStatus(t)" class="p-1 border rounded">
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </td>
          <td class="p-2">{{ t.assignee }}</td>
          <td class="p-2">
            <button @click="$emit('edit', t)" class="px-2 py-1 bg-blue-100 text-xs rounded">Edit</button>
            <button @click="onDelete(t)" class="px-2 py-1 bg-red-100 text-xs rounded text-red-600 ml-1">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <TaskModal :open="showModal" :isEdit="true" :initial="editing" @close="close" @save="save" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TaskModal from './TaskModal.vue'
import { useProjectStore } from '../stores/projectStore'

const store = useProjectStore()
const q = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')

const list = computed(() => store.filteredTasks)

const categories = computed(() => {
  const all = new Set(list.value.map(t => t.category).filter(Boolean))
  return Array.from(all)
})

const filtered = computed(() => {
  return list.value.filter(t => {
    if (q.value && !t.title.toLowerCase().includes(q.value.toLowerCase())) return false
    if (statusFilter.value && t.status !== statusFilter.value) return false
    if (categoryFilter.value && t.category !== categoryFilter.value) return false
    return true
  })
})

const paged = computed(() => filtered.value)

// Modal state
const showModal = ref(false)
const editing = ref(null)

function close() { showModal.value = false }
function save(data) {
  store.updateTask(store.selectedProjectId, editing.value.id, data)
  close()
}
function onDelete(task) {
  if (!confirm('Delete task?')) return
  const p = store.selectedProject
  const idx = p.tasks.findIndex(x => x.id === task.id)
  if (idx >= 0) p.tasks.splice(idx, 1)
}

function updateStatus(task) {
  store.updateTask(store.selectedProjectId, task.id, { status: task.status })
}
</script>
```

---
