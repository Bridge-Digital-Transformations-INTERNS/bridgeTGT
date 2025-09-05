<template>
  <header class="flex items-center justify-between p-4 bg-white shadow-md">
    <div class="flex items-center gap-3">
      <img src="/src/bridge-logo.png" alt="BridgeTGT" class="h-12" />

    </div>

    <div class="flex items-center gap-3 relative">
      <button @click="openProjectModal(false)" class="px-3 py-2 rounded bg-slate-100">+ Add Project</button>
      <button @click="openTaskModal(false)" class="px-3 py-2 rounded bg-slate-100">+ Add Task</button>

      <!-- Project dropdown -->
      <div class="relative">
        <button @click="toggleDropdown" class="px-3 py-2 border rounded">Projects ▼</button>
        <div v-if="showDropdown" class="absolute right-0 mt-2 bg-white border rounded shadow-md w-64 z-20 max-h-72 overflow-auto">
          <ul>
            <li v-for="p in store.projects" :key="p.id" class="px-3 py-2 hover:bg-gray-50 flex justify-between items-center group">
              <span @click="selectProject(p)" class="cursor-pointer">{{ p.name }}</span>
              <div class="opacity-0 group-hover:opacity-100 flex gap-1">
                <button @click.stop="openProjectModal(true, p)" class="text-xs px-2 py-1 bg-blue-100 rounded">Edit</button>
                <button @click.stop="askDelete(p)" class="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">Delete</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ProjectModal :open="showProjectModal" :isEdit="projectIsEdit" :initial="editingProjectObj" @close="closeProjectModal" @save="saveProject" />
    <TaskModal :open="showTaskModal" :isEdit="taskIsEdit" :initial="editingTaskObj" @close="closeTaskModal" @save="saveTask" />
    <ConfirmModal :open="showConfirm" title="Delete Project" message="Are you sure you want to delete this project?" @cancel="closeConfirm" @confirm="confirmDelete" />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectStore } from '../stores/projectStore'
import ProjectModal from './ProjectModal.vue'
import TaskModal from './TaskModal.vue'
import ConfirmModal from './ConfirmModal.vue'

const store = useProjectStore()

const showDropdown = ref(false)
function toggleDropdown() { showDropdown.value = !showDropdown.value }

function selectProject(p) { store.selectedProjectId = p.id; showDropdown.value = false }

// Project modal state
const showProjectModal = ref(false)
const projectIsEdit = ref(false)
const editingProjectObj = ref(null)

function openProjectModal(isEdit, project = null) {
  projectIsEdit.value = isEdit
  editingProjectObj.value = project
  showProjectModal.value = true
}
function closeProjectModal() { showProjectModal.value = false }
function saveProject(data) {
  if (projectIsEdit.value && editingProjectObj.value) {
    editingProjectObj.value.name = data.name
  } else {
    store.addProject(data.name)
  }
  closeProjectModal()
}

// Task modal state
const showTaskModal = ref(false)
const taskIsEdit = ref(false)
const editingTaskObj = ref(null)

function openTaskModal(isEdit, task = null) {
  taskIsEdit.value = isEdit
  editingTaskObj.value = task
  showTaskModal.value = true
}
function closeTaskModal() { showTaskModal.value = false }
function saveTask(data) {
  if (taskIsEdit.value && editingTaskObj.value) {
    store.updateTask(store.selectedProjectId, editingTaskObj.value.id, data)
  } else {
    store.addTask(store.selectedProjectId, data)
  }
  closeTaskModal()
}

// Delete confirm (fixed to use reactive ref)
const showConfirm = ref(false)
const projectToDelete = ref(null)
function askDelete(p) { projectToDelete.value = p; showConfirm.value = true }
function closeConfirm() { showConfirm.value = false; projectToDelete.value = null }
function confirmDelete() {
  if (projectToDelete.value) store.deleteProject(projectToDelete.value.id)
  closeConfirm()
}
</script>
