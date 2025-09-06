<template>
  <div class="mt-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
    <!-- Task Timeline Header -->
    <div class="flex items-center gap-3 mb-6">
      <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h2 class="text-xl font-semibold text-slate-800">Task Timeline</h2>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 items-center mb-5">
      <input
        v-model="taskStore.searchQuery"
        placeholder="Search tasks..."
        class="flex-1 min-w-[180px] px-3 py-2 border rounded-lg border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
      />
      <select
        v-model="taskStore.categoryFilter"
        class="px-3 py-2 border rounded-lg border-slate-200 text-sm"
      >
        <option value="">All Categories</option>
        <option value="light">Light</option>
        <option value="medium">Medium</option>
        <option value="heavy">Heavy</option>
      </select>
      <select
        v-model="taskStore.statusFilter"
        class="px-3 py-2 border rounded-lg border-slate-200 text-sm"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="inprogress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Task Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full table-fixed divide-y divide-slate-100 text-sm">
        <colgroup>
          <col style="width: 30%" />
          <col style="width: 12%" />
          <col style="width: 10%" />
          <col style="width: 20%" />
          <col style="width: 18%" />
          <col style="width: 10%" />
        </colgroup>

        <thead class="bg-slate-50">
          <tr class="text-left text-xs text-slate-500 uppercase">
            <th class="px-4 py-3">Tasks</th>
            <th class="px-4 py-3">Phase</th>
            <th class="px-4 py-3">Category</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Assignee</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <transition-group
          name="list"
          tag="tbody"
          class="bg-white divide-y divide-slate-100"
        >
          <tr
            v-for="t in taskStore.filteredTasks"
            :key="t.id"
            class="hover:bg-slate-50 last:border-b-0"
          >
            <td class="px-4 py-3 align-top">
              <div class="flex flex-col">
                <div class="font-medium text-slate-800 truncate">
                  {{ t.title }}
                </div>
                <div class="text-xs text-slate-400 truncate mt-1">
                  {{ t.description ?? "" }}
                </div>
              </div>
            </td>

            <td class="px-4 py-3 align-top">
              <div class="text-sm text-slate-700 whitespace-nowrap">
                {{ t.phase }}
              </div>
            </td>

            <td class="px-4 py-3 align-top">
              <div class="flex items-center justify-start">
                <CategoryBadge :category="t.weight" />
              </div>
            </td>

            <td class="px-4 py-3 align-top">
              <div class="flex items-center gap-2">
                <select
                  :value="t.status === 'completed' ? (t.validated ? 'completed-validated' : 'completed') : t.status"
                  @change="updateStatus(t, $event)"
                  class="px-2 py-1 border rounded-md text-xs bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="completed-validated">Validated</option>
                </select>
              </div>
            </td>

            <td class="px-4 py-3 align-top">
              <div class="text-sm text-slate-700 truncate">
                {{ t.assignee }}
              </div>
            </td>

            <td class="px-4 py-3 align-top text-right">
              <div class="inline-flex items-center gap-2">
                <button
                  @click="openEdit(t)"
                  class="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-100 hover:bg-blue-100"
                >
                  Edit
                </button>
                <button
                  @click="askDelete(t)"
                  class="px-3 py-1.5 bg-red-50 text-red-700 text-xs rounded-md border border-red-100 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </transition-group>
      </table>
    </div>

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
import { ref } from "vue";

import TaskModal from "./ui/TaskModal.vue";
import ConfirmModal from "./ui/ConfirmModal.vue";
import CategoryBadge from "./badges/CategoryBadge.vue";
import StatusBadge from "./badges/StatusBadge.vue";

import { useTaskStore } from "../stores/taskStore";

const taskStore = useTaskStore();

// Edit Task Modal
const showModal = ref(false);
const editing = ref(null);

function openEdit(task) {
  editing.value = task;
  showModal.value = true;
}
function close() {
  showModal.value = false;
}
function save(data) {
  taskStore.updateTask(editing.value.id, data);
  close();
}

// Delete Confirm Modal
const showConfirm = ref(false);
const taskToDelete = ref(null);

function askDelete(task) {
  taskToDelete.value = task;
  showConfirm.value = true;
}
function closeConfirm() {
  showConfirm.value = false;
  taskToDelete.value = null;
}
function confirmDelete() {
  if (!taskToDelete.value) return;
  taskStore.deleteTask(taskToDelete.value.id);
  closeConfirm();
}

// Inline status update
function updateStatus(task, event) {
  const newStatus = event.target.value;
  const isCompleted = newStatus === 'completed' || newStatus === 'completed-validated';
  const isValidated = newStatus === 'completed-validated';

  taskStore.updateTask(task.id, {
    status: isCompleted ? 'completed' : newStatus,
    validated: isValidated,
  });
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
e>
