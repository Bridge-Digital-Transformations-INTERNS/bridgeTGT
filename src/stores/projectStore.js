import { defineStore } from "pinia";
import { computed, ref } from "vue";

//Example Data para saimong mama
export const useProjectStore = defineStore("project", () => {
  const projects = ref([
    {
      id: 1,
      name: "Procurement System",
      tasks: [
        {
          id: 11,
          title: "Prototyping Dashboard",
          phase: "Designing",
          weight: "heavy",
          status: "completed",
          assignee: "Ana",
          estimatedDays: 3,
        },
        {
          id: 12,
          title: "Translate Landing Page",
          phase: "Implementation",
          weight: "medium",
          status: "inprogress",
          assignee: "Ben",
          estimatedDays: 2,
        },
        {
          id: 13,
          title: "Unit tests for API",
          phase: "Testing/QA",
          weight: "light",
          status: "pending",
          assignee: "Carlo",
          estimatedDays: 0.5,
        },
        {
          id: 14,
          title: "Design Forms",
          phase: "Designing",
          weight: "medium",
          status: "completed",
          assignee: "Dana",
          estimatedDays: 2,
        },
      ],
    },
  ]);

  const selectedProjectId = ref(1);

  const selectedProject = computed(() =>
    projects.value.find((p) => p.id === selectedProjectId.value),
  );

  // Project CRUD operations
  function addProject(name) {
    projects.value.push({ id: Date.now(), name, tasks: [] });
  }

  function deleteProject(id) {
    const idx = projects.value.findIndex((p) => p.id === id);
    if (idx >= 0) projects.value.splice(idx, 1);
    if (selectedProjectId.value === id && projects.value.length)
      selectedProjectId.value = projects.value[0].id;
    if (!projects.value.length) selectedProjectId.value = null;
  }

  // Task operations (delegated from TaskStore)
  function addTask(projectId, task) {
    const p = projects.value.find((x) => x.id === projectId);
    if (p) p.tasks.push({ ...task, id: Date.now() });
  }

  function updateTask(projectId, taskId, patch) {
    const p = projects.value.find((x) => x.id === projectId);
    if (!p) return;
    const t = p.tasks.find((x) => x.id === taskId);
    if (t) Object.assign(t, patch);
  }

  function deleteTask(projectId, taskId) {
    const p = projects.value.find((x) => x.id === projectId);
    if (!p) return;
    const idx = p.tasks.findIndex((x) => x.id === taskId);
    if (idx >= 0) p.tasks.splice(idx, 1);
  }

  return {
    // State
    projects,
    selectedProjectId,

    // Computed
    selectedProject,

    // Actions
    addProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
  };
});
