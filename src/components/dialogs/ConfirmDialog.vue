<template>
  <div
    v-if="state.open"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
  >
    <div class="card w-96">
      <h3>{{ state.title }}</h3>
      <p class="mb-4">{{ state.message }}</p>
      <div class="flex justify-end gap-2">
        <button class="input w-auto" @click="cancel">Cancel</button>
        <button class="btn w-auto" @click="ok">OK</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useConfirmState, resolveConfirm } from "@/composables/confirm";
const state = useConfirmState();
function ok() {
  resolveConfirm(true);
}
function cancel() {
  resolveConfirm(false);
}
</script>
