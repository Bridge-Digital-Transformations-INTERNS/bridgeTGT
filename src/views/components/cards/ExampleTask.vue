<script setup>
import { useTaskStore } from '@/stores/taskstores'
const taskStore = useTaskStore()

// Example: preload a task
taskStore.addTask("Prototype Dashboard", "Create UI design", "Design", "heavy")
</script>

<template>
  <div>
    <h1 class="text-xl font-bold mb-4">Dashboard</h1>

    <div v-for="task in taskStore.tasks" :key="task.id" class="p-4 mb-2 bg-[var(--color-sticky)] rounded">
      <h2>{{ task.title }}</h2>
      <p>{{ task.description }}</p>
      <p>Status: {{ task.status }}</p>
    </div>

    <p class="mt-4 font-bold">Progress: {{ taskStore.progress }}%</p>
  </div>
</template>
