<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 backdrop-blur-sm bg-black/20" @click="$emit('cancel')"></div>

    <div class="relative bg-white rounded-lg shadow-lg p-6 w-[400px] z-10">
      <h2 class="text-lg font-semibold mb-3">{{ title }}</h2>
      <p class="mb-4">{{ message }}</p>

      <div class="flex justify-end space-x-3">
        <button @click="$emit('cancel')" class="px-4 py-2 rounded bg-gray-200">
          Cancel
        </button>
        <button @click="$emit('confirm')" class="px-4 py-2 rounded bg-red-500 text-white">
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  message: String
})
</script>
