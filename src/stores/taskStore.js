import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { WEIGHTS } from "../utils/weights";
import { useProjectStore } from "./projectStore";

export const useTaskStore = defineStore("task", () => {
  // Task-specific filters
  const searchQuery = ref("");
  const statusFilter = ref("");
  const categoryFilter = ref("");
  const selectedPhase = ref("Overall");

  // Pagination
  const currentPage = ref(1);
  const itemsPerPage = ref(5);

  // Get project store for accessing project data
  const projectStore = useProjectStore();

  // Watch for filter changes and reset pagination
  watch([searchQuery, statusFilter, categoryFilter, selectedPhase], () => {
    currentPage.value = 1;
  });

  // Get current project's tasks
  const allTasks = computed(() => {
    const project = projectStore.selectedProject;
    return project ? project.tasks : [];
  });

  // Apply all filters to tasks
  const filteredTasks = computed(() => {
    let tasks = allTasks.value;

    // Phase filtering
    if (selectedPhase.value !== "Overall") {
      tasks = tasks.filter((t) => t.phase === selectedPhase.value);
    }

    // Search filtering
    if (searchQuery.value) {
      const search = searchQuery.value.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          (t.description && t.description.toLowerCase().includes(search)) ||
          (t.assignee && t.assignee.toLowerCase().includes(search)),
      );
    }

    // Status filtering
    if (statusFilter.value) {
      tasks = tasks.filter((t) => t.status === statusFilter.value);
    }

    // Category (weight) filtering
    if (categoryFilter.value) {
      tasks = tasks.filter((t) => t.weight === categoryFilter.value);
    }

    return tasks;
  });

  // Paginated tasks
  const paginatedTasks = computed(() => {
    const tasks = filteredTasks.value;
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return tasks.slice(start, end);
  });

  // Pagination info
  const paginationInfo = computed(() => {
    const totalItems = filteredTasks.value.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage.value);
    const startItem = totalItems === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1;
    const endItem = Math.min(currentPage.value * itemsPerPage.value, totalItems);

    return {
      totalItems,
      totalPages,
      currentPage: currentPage.value,
      startItem,
      endItem,
      hasNextPage: currentPage.value < totalPages,
      hasPrevPage: currentPage.value > 1,
    };
  });

  // Task statistics based on filtered tasks
  const taskStats = computed(() => {
    const tasks = filteredTasks.value;
    if (!tasks.length) {
      return {
        totalTasks: 0,
        light: 0,
        medium: 0,
        heavy: 0,
        completed: 0,
        inprogress: 0,
        pending: 0,
        totalPoints: 0,
        completedPoints: 0,
        percent: 0,
        percentDisplay: "0.0",
      };
    }

    const stats = {
      totalTasks: tasks.length,
      light: 0,
      medium: 0,
      heavy: 0,
      completed: 0,
      inprogress: 0,
      pending: 0,
      totalPoints: 0,
      completedPoints: 0,
    };

    tasks.forEach((t) => {
      // Weight counts
      if (t.weight === "light") stats.light += 1;
      if (t.weight === "medium") stats.medium += 1;
      if (t.weight === "heavy") stats.heavy += 1;

      // Status counts
      if (t.status === "completed") stats.completed += 1;
      if (t.status === "inprogress") stats.inprogress += 1;
      if (t.status === "pending") stats.pending += 1;

      // Points calculation
      const weight = WEIGHTS[t.weight] || 1;
      stats.totalPoints += weight;
      if (t.status === "completed") stats.completedPoints += weight;
    });

    stats.percent =
      stats.totalPoints === 0
        ? 0
        : (stats.completedPoints / stats.totalPoints) * 100;
    stats.percentDisplay = stats.percent.toFixed(1);

    return stats;
  });

  // Task CRUD operations
  function addTask(task) {
    const projectId = projectStore.selectedProjectId;
    if (projectId) {
      projectStore.addTask(projectId, task);
    }
  }

  function updateTask(taskId, patch) {
    const projectId = projectStore.selectedProjectId;
    if (projectId) {
      projectStore.updateTask(projectId, taskId, patch);
    }
  }

  function deleteTask(taskId) {
    const projectId = projectStore.selectedProjectId;
    if (projectId) {
      projectStore.deleteTask(projectId, taskId);
    }
  }

  // Pagination functions
  function goToPage(page) {
    const totalPages = Math.ceil(filteredTasks.value.length / itemsPerPage.value);
    if (page >= 1 && page <= totalPages) {
      currentPage.value = page;
    }
  }

  function nextPage() {
    const totalPages = Math.ceil(filteredTasks.value.length / itemsPerPage.value);
    if (currentPage.value < totalPages) {
      currentPage.value++;
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  }

  function setItemsPerPage(items) {
    itemsPerPage.value = items;
    currentPage.value = 1; // Reset to first page when changing items per page
  }

  // Reset all filters
  function resetFilters() {
    searchQuery.value = "";
    statusFilter.value = "";
    categoryFilter.value = "";
    selectedPhase.value = "Overall";
    currentPage.value = 1; // Reset pagination when filters change
  }

  return {
    // Filters
    searchQuery,
    statusFilter,
    categoryFilter,
    selectedPhase,

    // Pagination
    currentPage,
    itemsPerPage,

    // Computed
    allTasks,
    filteredTasks,
    paginatedTasks,
    paginationInfo,
    taskStats,

    // Actions
    addTask,
    updateTask,
    deleteTask,
    resetFilters,
    goToPage,
    nextPage,
    prevPage,
    setItemsPerPage,
  };
});
