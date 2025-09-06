<template>
  <header
    class="flex items-center justify-between px-14 py-4 bg-[var(--color-cream)] shadow-md"
  >
    <div class="flex justify-center items-center">
      <img src="/src/bridge-logo.png" alt="Bridge Logo" class="h-10" />
      <h1
        class="text-md  font-bold bg-gradient-to-r from-[var(--color-palm)] to-[var(--color-lime)] bg-clip-text text-transparent"
      >
        TGT
      </h1>
    </div>

    <div class="flex items-center gap-3 relative whitespace-nowrap">
      <!-- <div class="flex items-center gap-2 justify-between p-2">
        <Icon
          icon="material-symbols:folder-outline-rounded"
          width="18"
          height="18"
        />
        <p>Projects:</p>
      </div> -->

      <!-- Project dropdown -->
      <div class="relative" ref="dropdownRef">
        <button
          @click="toggleDropdown"
          class="justify-between px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-3 hover:border-gray-300 hover:shadow-sm transition-all duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer"
        >
          <!-- {{ projectStore.selectedProject?.name || "Add Project" }} -->
            Projects
          <span
            class="text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': showDropdown }"
            ><Icon
              icon="material-symbols:keyboard-arrow-down-rounded"
              width="24"
              height="24"
          /></span>
        </button>

        <transition name="dropdown-slide">
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 border border-gray-100 rounded-xl bg-white shadow-xl w-100 z-20 backdrop-blur-sm"
          >
            <div class="py-1">
              <div
                v-for="project in projectStore.projects"
                :key="project.id"
                class="px-4 py-3 hover:bg-gray-50 flex justify-between items-center group cursor-pointer transition-all duration-200 ease-in-out border-b border-gray-50 last:border-b-0 hover:scale-[1.01] hover:shadow-sm"
                :class="{
                  'bg-[var(--color-lime)]/10 border-[var(--color-lime)]/20':
                    projectStore.selectedProject?.id === project.id,
                }"
                @click="selectProject(project)"
              >
                <span
                  class="font-medium flex-1 min-w-0 pr-2 transition-colors duration-200 truncate overflow-hidden"
                  :class="{
                    'text-[var(--color-palm)] font-semibold':
                      projectStore.selectedProject?.id === project.id,
                    'text-gray-900':
                      projectStore.selectedProject?.id !== project.id,
                  }"
                  :title="project.name"
                >
                  {{ project.name }}
                </span>
                <div
                  class="opacity-0 group-hover:opacity-100 flex gap-2 transition-all duration-200 ease-in-out flex-shrink-0 transform translate-x-2 group-hover:translate-x-0"
                >
                  <button
                    @click.stop="openProjectModal(true, project)"
                    class="text-xs px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer transition-all duration-200 ease-in-out font-medium transform hover:scale-105 hover:shadow-md"
                    title="Edit project"
                  >
                    <Icon
                      icon="material-symbols:edit-outline"
                      width="12"
                      height="12"
                      class="inline mr-1"
                    />

                  </button>
                  <button
                    @click.stop="askDelete(project)"
                    class="text-xs px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer transition-all duration-200 ease-in-out font-medium transform hover:scale-105 hover:shadow-md"
                    title="Delete project"
                  >
                    <Icon
                      icon="material-symbols:delete-outline"
                      width="12"
                      height="12"
                      class="inline mr-1"
                    />

                  </button>
                </div>
              </div>
              <div
                v-if="projectStore.projects.length === 0"
                class="px-4 py-8 text-center text-gray-400"
              >
                <Icon
                  icon="material-symbols:folder-off-outline"
                  width="24"
                  height="24"
                  class="mx-auto mb-2 opacity-50 animate-pulse"
                />
                <p class="text-sm">No projects yet</p>
                <p class="text-xs text-gray-300">
                  Create your first project to get started
                </p>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <button
        @click="openProjectModal(false)"
        class="px-3 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 hover:-translate-y-0.5"
      >
        <Icon
          icon="material-symbols:create-new-folder-outline"
          width="20"
          height="20"
          class="transition-transform duration-200 hover:scale-110"
        />
      </button>
      <button
        @click="openTaskModal(false)"
        class="flex items-center gap-2 px-5 py-2 rounded-lg text-white bg-gradient-to-r from-[var(--color-palm)] to-[var(--color-lime)] hover:from-[var(--color-palm)]/90 hover:to-[var(--color-lime)]/90 transition-all duration-200 ease-in-out cursor-pointer transform hover:scale-105 hover:shadow-lg hover:-translate-y-0.5"
      >
        <Icon
          icon="material-symbols:add"
          width="15"
          height="15"
          class="transition-transform duration-200 group-hover:rotate-90"
        />
        <span class="transition-all duration-200">Add Task</span>
      </button>
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
import { useTaskStore } from "../stores/taskStore";
import ProjectModal from "./ui/ProjectModal.vue";
import TaskModal from "./ui/TaskModal.vue";
import ConfirmModal from "./ui/ConfirmModal.vue";
import { Icon } from "@iconify/vue";

const projectStore = useProjectStore();
const taskStore = useTaskStore();

const showDropdown = ref(false);
const dropdownRef = ref(null);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}
function selectProject(project) {
  projectStore.selectedProjectId = project.id;
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

function openProjectModal(isEdit, projectStore = null) {
  projectIsEdit.value = isEdit;
  editingProject.value = projectStore;
  showProjectModal.value = true;
}
function closeProjectModal() {
  showProjectModal.value = false;
}
function saveProject(data) {
  if (projectIsEdit.value && editingProject.value) {
    editingProject.value.name = data.name;
  } else {
    projectStore.addProject(data.name);
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
    taskStore.updateTask(editingTask.value.id, data);
  } else {
    taskStore.addTask(data);
  }
  closeTaskModal();
}

// Delete confirm for projects
const showConfirmProject = ref(false);
const projectToDelete = ref(null);
function askDelete(project) {
  projectToDelete.value = project;
  showConfirmProject.value = true;
}
function closeConfirmProject() {
  showConfirmProject.value = false;
  projectToDelete.value = null;
}
function confirmDeleteProject() {
  if (projectToDelete.value)
    projectStore.deleteProject(projectToDelete.value.id);
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
