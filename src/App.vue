<template>
  <div class="min-h-screen flex flex-col">
    <HeaderBar />

    <main class="p-6 max-w-6xl mx-auto w-full">
      <ProgressOverview />
      <TasksTable />
    </main>
  </div>
</template>

<script setup>
import HeaderBar from './components/HeaderBar.vue'
import ProgressOverview from './components/ProgressOverview.vue'
import TasksTable from './components/TaskTable.vue'
</script>
