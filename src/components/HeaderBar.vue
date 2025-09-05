<template>
  <header class="flex items-center justify-between p-4 bg-white shadow-md">
    <div class="flex items-center gap-3">
      <img src="/src/bridge-logo.png" alt="BridgeTGT" class="h-12" />
    </div>

    <div class="flex items-center gap-3 relative">
      <button
        @click="openProjectModal(false)"
        class="px-3 py-2 rounded bg-slate-100"
      >
        + Add Project
      </button>
      <button
        @click="openTaskModal(false)"
        class="px-3 py-2 rounded bg-slate-100"
      >
        + Add Task
      </button>

      <!-- Project dropdown -->
      <div class="relative" ref="dropdownRef">
        <button
          @click="toggleDropdown"
          class="px-3 py-2 border rounded flex items-center gap-1"
        >
          Projects <span>▼</span>
        </button>

        <transition name="dropdown-slide">
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 bg-white border rounded shadow-md w-64 z-20 max-h-72 overflow-auto"
          >
            <ul>
              <li
                v-for="p in store.projects"
                :key="p.id"
                class="px-3 py-2 hover:bg-[var(--color-lime)] hover:text-black flex justify-between items-center group cursor-pointer"
                @click="selectProject(p)"
              >
                <span>{{ p.name }}</span>
                <div class="opacity-0 group-hover:opacity-100 flex gap-1">
                  <button
                    @click.stop="openProjectModal(true, p)"
                    class="text-xs px-2 py-1 bg-blue-100 rounded"
                  >
                    Edit
                  </button>
                  <button
                    @click.stop="askDelete(p)"
                    class="text-xs px-2 py-1 bg-red-100 text-red-600 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>

    <!-- Modals -->
    <ProjectModal
      :open="showProjectModal"
      :isEdit="projectIsEdit"
      :initial="editingProject"
      @close="closeProjectModal"
      @save="saveProject"
    />
    <TaskModal
      :open="showTaskModal"
      :isEdit="taskIsEdit"
      :initial="editingTask"
      @close="closeTaskModal"
      @save="saveTask"
    />
    <ConfirmModal
      :open="showConfirmProject"
      title="Delete Project"
      message="Are you sure you want to delete this project?"
      @cancel="closeConfirmProject"
      @confirm="confirmDeleteProject"
    />
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useProjectStore } from "../stores/projectStore";
import ProjectModal from "./ProjectModal.vue";
import TaskModal from "./TaskModal.vue";
import ConfirmModal from "./ConfirmModal.vue";

const store = useProjectStore();

const showDropdown = ref(false);
const dropdownRef = ref(null);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}
function selectProject(p) {
  store.selectedProjectId = p.id;
  showDropdown.value = false;
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target))
    showDropdown.value = false;
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside),
);

// Project modal state
const showProjectModal = ref(false);
const projectIsEdit = ref(false);
const editingProject = ref(null);

function openProjectModal(isEdit, project = null) {
  projectIsEdit.value = isEdit;
  editingProject.value = project;
  showProjectModal.value = true;
}
function closeProjectModal() {
  showProjectModal.value = false;
}
function saveProject(data) {
  if (projectIsEdit.value && editingProject.value) {
    editingProject.value.name = data.name;
  } else {
    store.addProject(data.name);
  }
  closeProjectModal();
}

// Task modal state
const showTaskModal = ref(false);
const taskIsEdit = ref(false);
const editingTask = ref(null);

function openTaskModal(isEdit, task = null) {
  taskIsEdit.value = isEdit;
  editingTask.value = task;
  showTaskModal.value = true;
}
function closeTaskModal() {
  showTaskModal.value = false;
}
function saveTask(data) {
  if (taskIsEdit.value && editingTask.value) {
    store.updateTask(store.selectedProjectId, editingTask.value.id, data);
  } else {
    store.addTask(store.selectedProjectId, data);
  }
  closeTaskModal();
}

// Delete confirm for projects
const showConfirmProject = ref(false);
const projectToDelete = ref(null);
function askDelete(p) {
  projectToDelete.value = p;
  showConfirmProject.value = true;
}
function closeConfirmProject() {
  showConfirmProject.value = false;
  projectToDelete.value = null;
}
function confirmDeleteProject() {
  if (projectToDelete.value) store.deleteProject(projectToDelete.value.id);
  closeConfirmProject();
}
</script>

<style scoped>
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.15s ease;
}
.dropdown-slide-enter-from {
  transform: translateY(-6px);
  opacity: 0;
}
.dropdown-slide-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.dropdown-slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.dropdown-slide-leave-to {
  transform: translateY(-6px);
  opacity: 0;
}
</style>
