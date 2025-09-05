<template>
  <div class="mt-6 bg-white p-4 rounded-2xl shadow">
    <div class="flex gap-3 items-center mb-4">
      <input v-model="q" placeholder="Search tasks..." class="p-2 border rounded flex-1" />
      <select v-model="categoryFilter" class="p-2 border rounded">
        <option value="">All Categories</option>
      </select>
      <select v-model="statusFilter" class="p-2 border rounded">
        <option value="">All Status</option>
        <option value="completed">Completed</option>
        <option value="inprogress">In Progress</option>
        <option value="pending">Pending</option>
      </select>
      <select v-model="roleFilter" class="p-2 border rounded">
        <option value="">All Roles</option>
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
        <TaskRow v-for="t in paged" :key="t.id" :task="t" @edit="onEdit" @delete="onDelete" />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TaskRow from './TaskRow.vue'
import { useProjectStore } from '../stores/projectStore'

const store = useProjectStore()
const q = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const roleFilter = ref('')

const list = computed(() => store.filteredTasks)

const filtered = computed(() => {
  return list.value.filter(t => {
    if (q.value && !t.title.toLowerCase().includes(q.value.toLowerCase())) return false
    if (statusFilter.value && t.status !== statusFilter.value) return false
    return true
  })
})

const paged = computed(() => filtered.value)

function onEdit(task) {
  const status = prompt('Status (completed/inprogress/pending)', task.status)
  if (status) store.updateTask(store.selectedProjectId, task.id, { status })
}

function onDelete(task) {
  if (!confirm('Delete task?')) return
  const p = store.selectedProject
  const idx = p.tasks.findIndex(x => x.id === task.id)
  if (idx >= 0) p.tasks.splice(idx, 1)
}
</script>
