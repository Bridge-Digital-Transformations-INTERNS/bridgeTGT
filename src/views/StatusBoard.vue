<template>
  <div class="p-4 space-y-4">
    <HeaderBar
      :projects="projects"
      v-model="selectedProjectId"
      @addProject="showProjectModal = true"
      @addTask="showTaskModal = true"
    />

    <PhaseOverview :project="selectedProject" v-model="selectedPhase" />

    <TaskTable @edit="editTask" @delete="deleteTask" />

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
import { useProjectStore } from "@/stores/projectStore";
import { useTaskStore } from "@/stores/useTaskStore";

import HeaderBar from "@/components/HeaderBar.vue";
import PhaseOverview from "@/components/ProgressOverview.vue";
import TaskTable from "@/components/TaskRow.vue";
import AddProjectModal from "@/components/AddProjectModal.vue";
import AddTaskModal from "@/components/AddTaskModal.vue";

const projectStore = useProjectStore();
const taskStore = useTaskStore();

const selectedPhase = computed({
  get: () => taskStore.selectedPhase,
  set: (value) => {
    taskStore.selectedPhase = value;
  }
});
const showProjectModal = ref(false);
const showTaskModal = ref(false);

const projects = projectStore.projects;
const selectedProjectId = computed({
  get: () => projectStore.selectedProjectId,
  set: (value) => {
    projectStore.selectedProjectId = value;
  }
});
const selectedProject = computed(() => projectStore.selectedProject);

const editTask = (taskId) => {
  console.log("Edit task", taskId);
};
const deleteTask = (taskId) => {
  taskStore.deleteTask(taskId);
};
</script>
