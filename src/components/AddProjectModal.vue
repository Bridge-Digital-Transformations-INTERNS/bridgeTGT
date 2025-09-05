<template>
  <div class="fixed inset-0 bg-black/30 flex items-center justify-center">
    <div class="bg-white p-4">
      <h2>Add Project</h2>
      <input v-model="name" placeholder="Project name" />
      <button @click="add">Save</button>
      <button @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useProjectStore } from "@/stores/projectStore";

const name = ref("");
const store = useProjectStore();

const add = () => {
  if (name.value) {
    store.addProject(name.value);
    name.value = "";
    emit("close");
  }
};

const emit = defineEmits(["close"]);
</script>
