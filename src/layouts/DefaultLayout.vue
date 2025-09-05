<template>
  <div class="min-h-screen flex flex-col bg-[var(--color-powder)]">
    <!-- Global Header -->
    <HeaderBar
      :projects="projects"
      v-model="selectedProjectId"
      @addProject="showProjectModal = true"
      @addTask="showTaskModal = true"
      @editProject="editProject"
      @deleteProject="deleteProject"
    />

    <!-- Page body -->
    <main class="flex-1 p-6 ">
      <slot />
    </main>

    <!-- Project Modals -->
    <AddProjectModal
      v-if="showProjectModal"
      @close="showProjectModal = false"
    />
    <EditProjectModal
      v-if="showEditProjectModal"
      :projectId="selectedProjectId"
      @close="showEditProjectModal = false"
    />
    <AddTaskModal
      v-if="showTaskModal"
      :projectId="selectedProjectId"
      @close="showTaskModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useProjectStore } from "@/stores/projectStore";

import HeaderBar from "@/components/HeaderBar.vue";
import AddProjectModal from "@/components/AddProjectModal.vue";
import EditProjectModal from "@/components/EditProjectModal.vue";
import AddTaskModal from "@/components/AddTaskModal.vue";

const projectStore = useProjectStore();

// State
const selectedProjectId = ref(null);
const showProjectModal = ref(false);
const showTaskModal = ref(false);
const showEditProjectModal = ref(false);

const projects = projectStore.projects;

// Handlers
const editProject = () => {
  showEditProjectModal.value = true;
};
const deleteProject = () => {
  if (selectedProjectId.value) {
    projectStore.deleteProject(selectedProjectId.value);
    selectedProjectId.value = null;
  }
};
</script>
