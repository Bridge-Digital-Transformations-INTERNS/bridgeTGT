<template>
  <div class="p-4 space-y-4">
    <HeaderBar
      :projects="projects"
      v-model="selectedProjectId"
      @addProject="showProjectModal = true"
      @addTask="showTaskModal = true"
    />

    <PhaseOverview :project="selectedProject" v-model="selectedPhase" />

    <TaskTable :tasks="tasksForPhase" @edit="editTask" @delete="deleteTask" />

    <AddProjectModal
      v-if="showProjectModal"
      @close="showProjectModal = false"
    />
    <AddTaskModal
      v-if="showTaskModal"
      :projectId="selectedProjectId"
      @close="showTaskModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useProjectStore } from "@/stores/useProjectStore";
import { useTaskStore } from "@/stores/useTaskStore";

import HeaderBar from "@/components/HeaderBar.vue";
import PhaseOverview from "@/components/PhaseOverview.vue";
import TaskTable from "@/components/TaskTable.vue";
import AddProjectModal from "@/components/AddProjectModal.vue";
import AddTaskModal from "@/components/AddTaskModal.vue";

const projectStore = useProjectStore();
const taskStore = useTaskStore();

const selectedProjectId = ref(null);
const selectedPhase = ref("Overall");
const showProjectModal = ref(false);
const showTaskModal = ref(false);

const projects = projectStore.projects;
const selectedProject = computed(() =>
  projectStore.getProjectById(selectedProjectId.value),
);

const tasksForPhase = computed(() => {
  if (!selectedProject.value) return [];
  const allTasks = taskStore.getTasksByProject(selectedProjectId.value);
  if (selectedPhase.value === "Overall") return allTasks;
  return allTasks.filter((t) => t.phase === selectedPhase.value);
});

const editTask = (taskId) => {
  console.log("Edit task", taskId);
};
const deleteTask = (taskId) => {
  taskStore.deleteTask(taskId);
};
</script>
