import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref([])

  const addTask = (projectId, taskData) => {
    tasks.value.push({
      id: crypto.randomUUID(),
      projectId,
      ...taskData
    })
  }

  const getTasksByProject = (projectId) =>
    tasks.value.filter(t => t.projectId === projectId)

  const updateTask = (id, newData) => {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) tasks.value[idx] = { ...tasks.value[idx], ...newData }
  }

  const deleteTask = (id) => {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  return { tasks, addTask, getTasksByProject, updateTask, deleteTask }
})
