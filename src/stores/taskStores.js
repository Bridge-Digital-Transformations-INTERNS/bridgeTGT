import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import Task from '../models/Task'
import { weightPoints } from '../models/Progress'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: []
  }),

  getters: {
    getTasksByPhase: (state) => {
      return (phase) => state.tasks.filter(task => task.phase === phase)
    },

    progress(state) {
      const totalPoints = state.tasks.reduce((acc, task) => acc + weightPoints[task.weight], 0)
      const completedPoints = state.tasks
        .filter(task => task.status === "completed")
        .reduce((acc, task) => acc + weightPoints[task.weight], 0)

      return totalPoints ? Math.round((completedPoints / totalPoints) * 100) : 0
    }
  },

  actions: {
    addTask(title, description, phase, weight) {
      const newTask = new Task(uuidv4(), title, description, phase, weight)
      this.tasks.push(newTask)
    },

    updateTask(id, updates) {
      const task = this.tasks.find(t => t.id === id)
      if (task) Object.assign(task, updates)
    },

    deleteTask(id) {
      this.tasks = this.tasks.filter(t => t.id !== id)
    }
  }
})
