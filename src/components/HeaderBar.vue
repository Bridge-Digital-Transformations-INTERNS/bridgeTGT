<template>
  <header class="flex items-center justify-between p-4 bg-white shadow-md">
    <div class="flex items-center gap-3">
      <img src="/src/bridge-logo.png" alt="BridgeTGT" class="h-10" />
    </div>

    <div class="flex items-center gap-3">
      <button @click="onAddProject" class="px-3 py-2 rounded bg-slate-100">+ Add Project</button>
      <button @click="onAddTask" class="px-3 py-2 rounded bg-slate-100">+ Add Task</button>

      <div>
        <select v-model="store.selectedProjectId" class="p-2 border rounded">
          <option v-for="p in store.projects" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>

      <div class="relative">
        <button class="p-2 border rounded">Options ▾</button>
        <!-- simple options dropdown -->
        <div class="absolute right-0 mt-2 w-40 bg-white border rounded shadow p-2 z-10">
          <button @click="editProject" class="w-full text-left p-2">Edit</button>
          <button @click="deleteProject" class="w-full text-left p-2 text-red-600">Delete</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useProjectStore } from '../stores/projectStore'
const store = useProjectStore()

function onAddProject() {
  const name = prompt('Project name')
  if (name) store.addProject(name)
}

function onAddTask() {
  // very simple ad-hoc task creation for starter
  const title = prompt('Task title')
  if (!title) return
  const phase = prompt('Phase (Planning/Analysis/Designing/Implementation/Testing/Overall)', 'Designing')
  const weight = prompt('Weight (light/medium/heavy)', 'medium')
  store.addTask(store.selectedProjectId, { title, phase, weight, status: 'pending', assignee: 'Unassigned', estimatedDays: 1 })
}

function editProject() {
  const name = prompt('New name', store.selectedProject?.name)
  if (name && store.selectedProject) store.selectedProject.name = name
}

function deleteProject() {
  if (!store.selectedProject) return
  if (confirm('Delete project?')) store.deleteProject(store.selectedProject.id)
}
</script>
