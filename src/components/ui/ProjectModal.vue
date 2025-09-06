<template>
  <Modal
    :open="open"
    :title="isEdit ? 'Edit Project' : 'Add Project'"
    @cancel="close"
    @confirm="save"
  >
    <div class="flex flex-col gap-3">
      <label class="text-sm font-medium">Project Name</label>
      <input
        v-model="name"
        class="p-2  border border-slate-200 rounded outline-none"
        placeholder="Enter project name"
      />
    </div>
  </Modal>
</template>

<script setup>
import Modal from "./ModalCom.vue";
import { ref, watch } from "vue";

const props = defineProps({ open: Boolean, isEdit: Boolean, initial: Object });
const emits = defineEmits(["close", "save"]);

const name = ref("");

watch(
  () => props.initial,
  (val) => {
    name.value = val?.name || "";
  },
  { immediate: true },
);

function close() {
  emits("close");
}
function save() {
  emits("save", { name: name.value });
}
</script>
