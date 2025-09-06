<template>
  <div class="mt-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
    <!-- Task Timeline Header -->
    <div class="flex items-center gap-3 mb-6">
      <svg
        class="w-6 h-6 text-slate-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <h2 class="text-xl font-semibold text-slate-800">Task Timeline</h2>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 items-center mb-5">
      <div class="relative flex-1 min-w-[180px]">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          v-model="taskStore.searchQuery"
          placeholder="Search tasks..."
          class="w-full pl-10 pr-3 py-2 border rounded-lg border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
        />
      </div>
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
    <div class="overflow-x-auto h-125 overflow-y-auto border border-slate-200 rounded-lg">
      <table class="min-w-full table-fixed divide-y divide-slate-100 text-sm">
        <colgroup>
          <col style="width: 30%" />
          <col style="width: 12%" />
          <col style="width: 10%" />
          <col style="width: 20%" />
          <col style="width: 18%" />
          <col style="width: 10%" />
        </colgroup>

        <thead class="bg-slate-50 sticky top-0 z-10">
          <tr class="text-left text-xs text-slate-500 uppercase">
            <th class="px-4 py-3">Tasks</th>
            <th class="px-4 py-3">Phase</th>
            <th class="px-4 py-3">Category</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Assignee</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-slate-100">
          <tr
            v-for="t in taskStore.displayTasks"
            :key="t.id"
            class="hover:bg-slate-50 last:border-b-0"
          >
            <td class="px-4 py-3 align-middle">
              <div class="flex flex-col">
                <div class="font-medium text-slate-800 truncate">
                  {{ t.title }}
                </div>
                <div class="text-xs text-slate-400 truncate mt-1">
                  {{ t.description ?? "" }}
                </div>
              </div>
            </td>

            <td class="px-4 py-3 align-middle">
              <div class="text-sm text-slate-700 whitespace-nowrap">
                {{ t.phase }}
              </div>
            </td>

            <td class="px-4 py-3 align-middle">
              <div class="flex items-center justify-start">
                <CategoryBadge :category="t.weight" />
              </div>
            </td>

            <td class="px-4 py-3 align-middle">
              <div class="flex items-center gap-2">
                <StatusDropdown
                  :value="t.status"
                  :validated="t.validated"
                  @update:value="updateStatus(t, $event)"
                />
              </div>
            </td>

            <td class="px-4 py-3 align-middle">
              <div class="text-sm text-slate-700 truncate">
                {{ t.assignee }}
              </div>
            </td>

            <td class="px-4 py-3 align-middle text-right">
              <div class="inline-flex items-center gap-2">
                <button
                  @click="openEdit(t)"
                  class="p-2 bg-blue-50 text-blue-700 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors"
                  title="Edit task"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="askDelete(t)"
                  class="p-2 bg-red-50 text-red-700 rounded-md border border-red-100 hover:bg-red-100 transition-colors"
                  title="Delete task"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
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
import TaskModal from "./ui/TaskModal.vue";
import { ref } from "vue";
import ConfirmModal from "./ui/ConfirmModal.vue";
import CategoryBadge from "./badges/CategoryBadge.vue";
import StatusDropdown from "./ui/StatusDropdown.vue";
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
  // Handle both old event structure and new object structure
  let newStatus, isValidated;

  if (event && typeof event === 'object' && 'status' in event) {
    // New StatusDropdown event structure
    newStatus = event.status;
    isValidated = event.validated;
  } else {
    // Old select event structure (fallback)
    newStatus = event.target.value;
    const isCompleted = newStatus === "completed" || newStatus === "completed-validated";
    isValidated = newStatus === "completed-validated";
    newStatus = isCompleted ? "completed" : newStatus;
  }

  taskStore.updateTask(task.id, {
    status: newStatus,
    validated: isValidated,
  });
}
</script>

