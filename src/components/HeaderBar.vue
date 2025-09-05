<template>
  <header class="flex gap-4 items-center bg-white">
    <button @click="$emit('addProject')">Add Project</button>
    <button @click="$emit('addTask')" :disabled="!modelValue">Add Task</button>
    <select v-model="selectedProject">
      <option disabled value="">Select Project</option>
      <option v-for="p in projects" :key="p.id" :value="p.id">
        {{ p.name }}
      </option>
    </select>
  </header>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({ projects: Array, modelValue: String });
const emit = defineEmits(["update:modelValue", "addProject", "addTask"]);

const selectedProject = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
