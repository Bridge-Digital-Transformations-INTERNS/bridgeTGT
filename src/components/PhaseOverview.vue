<template>
  <div v-if="project" class="border p-4">
    <h2>{{ project.name }} - Phase Overview</h2>

    <select v-model="selectedPhase">
      <option>Overall</option>
      <option v-for="p in project.phases" :key="p">{{ p }}</option>
    </select>

    <p>Progress: {{ progress.toFixed(1) }}%</p>
    <p>Total Tasks: {{ tasksForPhase.length }}</p>
    <p>Completed: {{ completedCount }}</p>
    <p>In Progress: {{ inProgressCount }}</p>
    <p>Pending: {{ pendingCount }}</p>
  </div>
  <p v-else>Select a project.</p>
</template>

<script setup>
import { computed } from "vue";
import { useTaskStore } from "@/stores/useTaskStore";

const props = defineProps({ project: Object, modelValue: String });
const emit = defineEmits(["update:modelValue"]);

const selectedPhase = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  }
});

const taskStore = useTaskStore();

const tasksForPhase = computed(() => {
  if (!props.project) return [];
  const allTasks = taskStore.getTasksByProject(props.project.id);
  if (props.modelValue === "Overall") return allTasks;
  return allTasks.filter((t) => t.phase === props.modelValue);
});

const completedCount = computed(
  () => tasksForPhase.value.filter((t) => t.status === "Completed").length,
);
const inProgressCount = computed(
  () => tasksForPhase.value.filter((t) => t.status === "In Progress").length,
);
const pendingCount = computed(
  () => tasksForPhase.value.filter((t) => t.status === "Pending").length,
);

const progress = computed(() => {
  if (!tasksForPhase.value.length) return 0;
  return (completedCount.value / tasksForPhase.value.length) * 100;
});
</script>
