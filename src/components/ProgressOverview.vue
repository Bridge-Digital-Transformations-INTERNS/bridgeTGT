<template>
  <div class="bg-white p-6 rounded-2xl shadow">
    <div class="flex items-start justify-between">
      <div>
        <h2 class="text-lg font-bold mb-1">
          {{ project?.name || "Project" }} - Phase Overview
        </h2>
        <div class="text-sm text-slate-500">
          Select phase to filter the overview
        </div>
      </div>

      <div>
        <select v-model="store.selectedPhase" class="p-2 border rounded">
          <option>Overall</option>
          <option>Planning</option>
          <option>Analysis</option>
          <option>Designing</option>
          <option>Implementation</option>
          <option>Testing/QA</option>
        </select>
      </div>
    </div>

    <div class="mt-4">
      <div class="mb-2 font-medium">{{ titleLabel }}</div>
      <div class="w-full h-4 bg-gray-200 rounded overflow-hidden mb-3">
        <div
          class="h-4 rounded"
          :style="{
            width: percent + '%',
            background:
              'linear-gradient(90deg, var(--color-lime), var(--color-palm))',
          }"
        ></div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="text-sm text-slate-700 font-semibold">
            {{ percent.toFixed(1) }}%
          </div>
          <div class="text-xs text-slate-600">
            {{ completedPoints }} / {{ totalPoints }} points
          </div>
          <div class="text-xs text-slate-600">
            {{ completedTasks }} / {{ totalTasks }} tasks
          </div>
        </div>

        <div>
          <div class="text-sm font-medium">Total Tasks</div>
          <div class="text-lg font-bold">{{ totalTasks }}</div>
          <div class="text-sm text-slate-600">
            Light: {{ light }} | Medium: {{ medium }} | Heavy: {{ heavy }}
          </div>

          <div class="mt-3 text-sm font-medium">Status</div>
          <div class="text-sm">Completed: {{ completedTasks }}</div>
          <div class="text-sm">In Progress: {{ inprogress }}</div>
          <div class="text-sm">Pending: {{ pending }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useProjectStore } from "../stores/projectStore";

const store = useProjectStore();

const project = computed(
  () => store.selectedProject || { name: "No Project", tasks: [] },
);

// Use the store's selectedPhase so it remains global
const filtered = computed(() => {
  if (!project.value) return [];
  if (!store.selectedPhase || store.selectedPhase === "Overall")
    return project.value.tasks;
  return project.value.tasks.filter((t) => t.phase === store.selectedPhase);
});

const weightPoints = { light: 1, medium: 2, heavy: 3 };

const totalPoints = computed(() =>
  filtered.value.reduce((a, t) => a + (weightPoints[t.weight] || 1), 0),
);
const completedPoints = computed(() =>
  filtered.value
    .filter((t) => t.status === "completed")
    .reduce((a, t) => a + (weightPoints[t.weight] || 1), 0),
);

const totalTasks = computed(() => filtered.value.length);
const completedTasks = computed(
  () => filtered.value.filter((t) => t.status === "completed").length,
);
const inprogress = computed(
  () => filtered.value.filter((t) => t.status === "inprogress").length,
);
const pending = computed(
  () => filtered.value.filter((t) => t.status === "pending").length,
);

const light = computed(
  () => filtered.value.filter((t) => t.weight === "light").length,
);
const medium = computed(
  () => filtered.value.filter((t) => t.weight === "medium").length,
);
const heavy = computed(
  () => filtered.value.filter((t) => t.weight === "heavy").length,
);

const percent = computed(() =>
  totalPoints.value ? (completedPoints.value / totalPoints.value) * 100 : 0,
);

const titleLabel = computed(() =>
  store.selectedPhase && store.selectedPhase !== "Overall"
    ? `${store.selectedPhase} Progress`
    : "Overall Progress",
);
</script>
