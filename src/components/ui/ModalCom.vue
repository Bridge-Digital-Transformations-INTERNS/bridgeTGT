<template>
  <transition name="modal-fade">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
      <div
        class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-8 relative transform transition-transform duration-200 scale-100"
      >
        <h3 class="text-xl font-semibold mb-6 text-gray-800">{{ title }}</h3>
        <slot />
        <div class="mt-8 flex justify-end gap-4">
          <button
        @click="$emit('cancel')"
        class="cursor-pointer px-6 py-2.5 rounded-lg border border-slate-200 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
          >
        Cancel
          </button>
          <button
        @click="$emit('confirm')"
        class="cursor-pointer px-6 py-2.5 rounded-lg text-white transition-all duration-200 shadow-md"
        style="background: linear-gradient(to left, var(--color-lime), var(--color-palm));"
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
