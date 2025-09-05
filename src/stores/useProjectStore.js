import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref([])

  const addProject = (name) => {
    const project = {
      id: crypto.randomUUID(),
      name,
      phases: ["Planning", "Analysis", "Designing", "Implementation", "Testing/QA"]
    }
    projects.value.push(project)
    return project
  }

  const getProjectById = (id) => projects.value.find(p => p.id === id)

  const updateProject = (id, newData) => {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) projects.value[idx] = { ...projects.value[idx], ...newData }
  }

  const deleteProject = (id) => {
    projects.value = projects.value.filter(p => p.id !== id)
  }

  return { projects, addProject, getProjectById, updateProject, deleteProject }
})
