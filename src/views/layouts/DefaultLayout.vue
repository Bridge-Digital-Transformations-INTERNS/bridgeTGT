<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900">
    <!-- Header -->
    <header class="bg-white shadow-md p-7 flex justify-between items-center">
      <h1
        class="text-xl font-bold text-indigo-600"
        style="font-family: var(--font-fkmono)"
      >
        BridgeTGT
      </h1>
      <div class="bg-[var(--color-lime)] text-[var(--color-cacao)]">
        Task in Lime background with Cacao text
      </div>

      <button
        class="bg-[var(--color-palm)] text-[var(--color-cream)] px-4 py-2 rounded-lg"
      >
        Palm Button
      </button>

      <PhaseDropdown v-model="selectedPhase" />
    </header>

    <main class="flex-1 p-6 bg-[var(--color-cream)]">
      <slot :selectedPhase="selectedPhase">
        <ExampleTask/>
      </slot>
    </main>
  </div>
</template>

<script setup>
import ExampleTask from '../components/cards/ExampleTask.vue'
</script>
