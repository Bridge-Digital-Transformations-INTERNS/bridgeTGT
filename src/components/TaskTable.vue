<template>
  <div class="mt-6 bg-white p-4 rounded-2xl shadow">
    <!-- Filters -->
    <div class="flex gap-3 items-center mb-4">
      <input
        v-model="q"
        placeholder="Search tasks..."
        class="p-2 border rounded flex-1"
      />
      <select v-model="categoryFilter" class="p-2 border rounded">
        <option value="">All Categories</option>
        <option value="light">Light</option>
        <option value="medium">Medium</option>
        <option value="heavy">Heavy</option>
      </select>
      <select v-model="statusFilter" class="p-2 border rounded">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="inprogress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Task Table -->
    <table class="w-full table-fixed border-collapse">
      <thead>
        <tr class="text-left text-sm text-slate-600 border-b">
          <th class="p-2 w-[20%]">Task</th>
          <th class="p-2 w-[15%]">Phase</th>
          <th class="p-2 w-[12%]">Category</th>
          <th class="p-2 w-[20%]">Status</th>
          <th class="p-2 w-[15%]">Assignee</th>
          <th class="p-2 w-[18%]">Actions</th>
        </tr>
      </thead>
      <transition-group name="list" tag="tbody">
        <tr v-for="t in paged" :key="t.id" class="border-b">
          <td class="p-2">{{ t.title }}</td>
          <td class="p-2">{{ t.phase }}</td>
          <td class="p-2">
            <CategoryBadge :category="t.weight" />
          </td>
          <td class="p-2 flex items-center gap-2">
            <StatusBadge :status="t.status" :validated="t.validated" />
            <select
              v-model="t.status"
              @change="updateStatus(t)"
              class="p-1 border rounded text-xs"
            >
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              v-if="t.status === 'completed'"
              v-model="t.validated"
              @change="updateStatus(t)"
              class="p-1 border rounded text-xs"
            >
              <option :value="false">Not Validated</option>
              <option :value="true">Validated</option>
            </select>
          </td>
          <td class="p-2">{{ t.assignee }}</td>
          <td class="p-2">
            <button
              @click="openEdit(t)"
              class="px-2 py-1 bg-blue-100 text-xs rounded"
            >
              Edit
            </button>
            <button
              @click="askDelete(t)"
              class="px-2 py-1 bg-red-100 text-xs rounded text-red-600 ml-1"
            >
              Delete
            </button>
          </td>
        </tr>
      </transition-group>
    </table>

    <!-- Task Modal -->
    <TaskModal
      :open="showModal"
      :isEdit="true"
      :initial="editing"
      @close="close"
      @save="save"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      :open="showConfirm"
      title="Delete Task"
      message="Are you sure you want to delete this task?"
      @cancel="closeConfirm"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import TaskModal from "./TaskModal.vue"
import ConfirmModal from "./ConfirmModal.vue"
import CategoryBadge from "./CategoryBadge.vue"
import StatusBadge from "./StatusBadge.vue"
import { useProjectStore } from "../stores/projectStore"

const store = useProjectStore()
const q = ref("")
const statusFilter = ref("")
const categoryFilter = ref("")

// Filters
const list = computed(() => store.filteredTasks)

const filtered = computed(() => {
  return list.value.filter((t) => {
    if (q.value && !t.title.toLowerCase().includes(q.value.toLowerCase())) return false
    if (statusFilter.value && t.status !== statusFilter.value) return false
    if (categoryFilter.value && t.weight !== categoryFilter.value) return false
    return true
  })
})

const paged = computed(() => filtered.value)

// Edit Task Modal
const showModal = ref(false)
const editing = ref(null)

function openEdit(task) {
  editing.value = task
  showModal.value = true
}
function close() {
  showModal.value = false
}
function save(data) {
  store.updateTask(store.selectedProjectId, editing.value.id, data)
  close()
}

// Delete Confirm Modal
const showConfirm = ref(false)
const taskToDelete = ref(null)

function askDelete(task) {
  taskToDelete.value = task
  showConfirm.value = true
}
function closeConfirm() {
  showConfirm.value = false
  taskToDelete.value = null
}
function confirmDelete() {
  if (!taskToDelete.value) return
  const p = store.selectedProject
  const idx = p.tasks.findIndex((x) => x.id === taskToDelete.value.id)
  if (idx >= 0) p.tasks.splice(idx, 1)
  closeConfirm()
}

// Inline status update
function updateStatus(task) {
  store.updateTask(store.selectedProjectId, task.id, {
    status: task.status,
    validated: task.validated ?? false,
  })
}
</script>

<style scoped>
.list-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.list-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.list-enter-active {
  transition: all 0.18s ease;
}
.list-leave-from {
  opacity: 1;
}
.list-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.list-leave-active {
  transition: all 0.15s ease;
}
</style>
