<template>
  <div
    class="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <h2 class="text-xl md:text-2xl font-semibold text-slate-800 truncate">
          {{ project?.name || "Project" }}
          <!-- <span class="text-sm text-slate-400">— Phase Overview</span> -->
        </h2>
      </div>

      <div class="flex-col">
        <div class="flex items-center gap-3 justify-end">
          <label class="sr-only" for="phase">Select Phase</label>
          <div class="relative">
            <select
              id="phase"
              v-model="taskStore.selectedPhase"
              class="appearance-none py-2 pl-3 pr-8 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              aria-label="Select project phase"
            >
              <option>Overall</option>
              <option>Planning</option>
              <option>Analysis</option>
              <option>Designing</option>
              <option>Implementation</option>
              <option>Testing/QA</option>
            </select>
            <svg
              class="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p class="mt-1 text-sm text-slate-500">Choose a phase to filter</p>
      </div>
    </div>

    <div class="mt-6">
      <!-- Progress summary -->
      <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
        <div class="flex items-center justify-between gap-4">
          <div>
            <div class="text-sm text-slate-500 font-medium">
              {{ titleLabel }}
            </div>
            <div class="mt-1 text-2xl font-semibold text-slate-800">
              {{ percentDisplay }}%
            </div>
            <div class="text-xs text-slate-500 mt-1">
              {{ completedPoints }} / {{ totalPoints }} points •
              {{ completedTasks }} / {{ totalTasks }} tasks
            </div>
          </div>

          <!-- <div class="flex items-center gap-3">
        <div class="text-xs text-slate-500">Weight</div>
        <div
          class="flex items-center gap-2 bg-white border border-slate-100 px-3 py-1 rounded-lg shadow-sm"
        >
          <div class="flex items-center gap-3 text-sm text-slate-700">
          <span class="inline-flex items-center gap-2"
            ><span class="w-2 h-2 rounded-full bg-green-400"></span>Light
            {{ light }}</span
          >
          <span class="inline-flex items-center gap-2"
            ><span class="w-2 h-2 rounded-full bg-amber-400"></span>Medium
            {{ medium }}</span
          >
          <span class="inline-flex items-center gap-2"
            ><span class="w-2 h-2 rounded-full bg-rose-400"></span>Heavy
            {{ heavy }}</span
          >
          </div>
        </div>
        </div> -->
        </div>

        <div class="mt-4">
          <div
            class="w-full h-4 rounded-full bg-gradient-to-r from-slate-100 to-slate-100 overflow-hidden relative"
          >
            <div
              class="h-4 rounded-full shadow-sm transition-all duration-700"
              :style="{
                width: percent + '%',
                background: 'linear-gradient(90deg,#7DD56F,#3AB5A4)',
              }"
              role="progressbar"
              :aria-valuenow="Math.round(percent)"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
            <div
              class="absolute inset-0 flex items-center justify-center text-xs text-slate-700 font-medium"
            >
              <span class="bg-white/60 px-2 py-0.5 rounded-full"
                >{{ percentDisplay }}%</span
              >
            </div>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            class="bg-white p-3 rounded-lg border border-slate-100 shadow-sm"
          >
            <div class="text-xs text-slate-500">Total Tasks</div>
            <div class="text-lg font-semibold text-slate-800">
              {{ totalTasks }}
            </div>
          </div>

          <div
            class="bg-white p-3 rounded-lg border border-slate-100 shadow-sm"
          >
            <div class="text-xs text-slate-500">Completed</div>
            <div class="text-lg font-semibold text-green-600">
              {{ completedTasks }}
            </div>
          </div>

          <div
            class="bg-white p-3 rounded-lg border border-slate-100 shadow-sm"
          >
            <div class="text-xs text-slate-500">Points</div>
            <div class="text-lg font-semibold text-slate-800">
              {{ totalPoints }}
            </div>
          </div>
        </div>

        <div class="mt-4 flex gap-3">
          <div
            class="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm"
          >
            <Icon icon="ic:round-hourglass-bottom" width="15" height="15" />
            Pending: {{ pending }}
          </div>
          <div
            class="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm"
          >
            <Icon icon="mdi:clock" width="15" height="15" />
            In Progress: {{ inprogress }}
          </div>
          <div
            class="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm"
          >
            <Icon
              icon="material-symbols:check-circle-rounded"
              width="15"
              height="15"
            />
            Completed: {{ completedTasks }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useProjectStore } from "../stores/projectStore";
import { useTaskStore } from "../stores/taskStore";
import { Icon } from "@iconify/vue";

const projectStore = useProjectStore();
const taskStore = useTaskStore();

const project = computed(
  () => projectStore.selectedProject || { name: "No Project", tasks: [] },
);

const stats = computed(() => taskStore.taskStats);
const totalPoints = computed(() => stats.value.totalPoints);
const completedPoints = computed(() => stats.value.completedPoints);
const totalTasks = computed(() => stats.value.totalTasks);
const completedTasks = computed(() => stats.value.completed);
const inprogress = computed(() => stats.value.inprogress);
const pending = computed(() => stats.value.pending);
// const light = computed(() => stats.value.light);
// const medium = computed(() => stats.value.medium);
// const heavy = computed(() => stats.value.heavy);
const percent = computed(() => stats.value.percent);
const percentDisplay = computed(() => stats.value.percentDisplay);

const titleLabel = computed(() =>
  taskStore.selectedPhase && taskStore.selectedPhase !== "Overall"
    ? `${taskStore.selectedPhase} Progress`
    : "Overall Progress",
);
</script>
