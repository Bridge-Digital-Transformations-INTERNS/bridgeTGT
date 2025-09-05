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
        <transition-group name="list" tag="tbody">
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
              <button @click="openEdit(t)" class="px-2 py-1 bg-blue-100 text-xs rounded">Edit</button>
              <button @click="onDelete(t)" class="px-2 py-1 bg-red-100 text-xs rounded text-red-600 ml-1">Delete</button>
            </td>
          </tr>
        </transition-group>
      </tbody>
    </table>

    <TaskModal :open="showModal" :isEdit="true" :initial="editing" @close="close" @save="save" />
    <ConfirmModal :open="showConfirm" title="Delete Task" message="Are you sure you want to delete this task?" @cancel="closeConfirm" @confirm="confirmDelete" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TaskModal from './TaskModal.vue'
import ConfirmModal from './ConfirmModal.vue'
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

function openEdit(task) {
  editing.value = task
  showModal.value = true
}

function close() { showModal.value = false }

function save(data) {
  store.updateTask(store.selectedProjectId, editing.value.id, data)
  close()
}

// Confirm delete for tasks
const showConfirm = ref(false)
const taskToDelete = ref(null)
function onDelete(task) { taskToDelete.value = task; showConfirm.value = true }
function closeConfirm() { showConfirm.value = false; taskToDelete.value = null }
function confirmDelete() {
  if (!taskToDelete.value) return
  const p = store.selectedProject
  const idx = p.tasks.findIndex(x => x.id === taskToDelete.value.id)
  if (idx >= 0) p.tasks.splice(idx, 1)
  closeConfirm()
}

function updateStatus(task) {
  store.updateTask(store.selectedProjectId, task.id, { status: task.status })
}
</script>

<style scoped>
.list-enter-from { opacity: 0; transform: translateY(-6px) }
.list-enter-to { opacity: 1; transform: translateY(0) }
.list-enter-active { transition: all 0.18s ease }
.list-leave-from { opacity: 1 }
.list-leave-to { opacity: 0; transform: translateY(-6px) }
.list-leave-active { transition: all 0.15s ease }
</style>
