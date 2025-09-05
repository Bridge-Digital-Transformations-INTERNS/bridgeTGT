<template>
  <div class="p-6 bg-white rounded-2xl shadow">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-lg font-bold">{{ project?.name || 'Project' }} - Phase Overview</h2>
        <p class="text-sm text-slate-500">Overall(phase Dropdown)</p>
      </div>

      <select v-model="store.selectedPhase" class="p-2 border rounded">
        <option>Planning</option>
        <option>Analysis</option>
        <option>Designing</option>
        <option>Implementation</option>
        <option>Testing/QA</option>
        <option>Overall</option>
      </select>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-6">
      <div>
        <p class="text-sm font-medium">Overall Progress</p>
        <p class="text-3xl font-bold">{{ store.percent.toFixed(1) }}%</p>
        <p class="text-sm text-slate-600">{{ store.points.completed }} / {{ store.points.total }} points</p>
        <p class="text-sm text-slate-600">{{ store.counts.completed }} / {{ store.counts.totalTasks }} tasks</p>
      </div>

      <div>
        <p class="font-medium">Total Tasks</p>
        <p class="text-lg">{{ store.counts.totalTasks }}</p>
        <p class="text-sm">Light: {{ store.counts.light }} | Medium: {{ store.counts.medium }} | Heavy: {{ store.counts.heavy }}</p>

        <div class="mt-2">
          <p class="text-sm font-medium">Status</p>
          <p class="text-sm">Completed: {{ store.counts.completed }}</p>
          <p class="text-sm">In Progress: {{ store.counts.inprogress }}</p>
          <p class="text-sm">Pending: {{ store.counts.pending }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProjectStore } from '../stores/projectStore'
const store = useProjectStore()
const project = store.selectedProject
</script>
