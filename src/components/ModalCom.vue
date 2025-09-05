<template>
  <transition name="modal-fade">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative transform transition-transform duration-200 scale-100"
      >
        <h3 class="text-lg font-bold mb-4">{{ title }}</h3>
        <slot />
        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 rounded bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            class="px-4 py-2 rounded bg-indigo-600 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  open: Boolean,
  title: String,
});
</script>
<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.18s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
