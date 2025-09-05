<template>
  <div
    class="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <h2 class="text-xl md:text-2xl font-semibold text-slate-800 truncate">
          {{ project?.name || "Project" }}
          <span class="text-sm text-slate-400">— Phase Overview</span>
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Choose a phase to filter the metrics below
        </p>
      </div>

      <div class="flex items-center gap-3">
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
    </div>

    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Left: Progress summary -->
      <div
        class="md:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-100"
      >
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

          <div class="flex items-center gap-3">
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
          </div>
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
            class="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm"
          >
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M16.704 5.29a.75.75 0 00-1.06-1.06L8 11.873 4.354 8.227a.75.75 0 10-1.06 1.06l4 4a.75.75 0 001.06 0l8.35-8.35z"
              />
            </svg>
            Completed: {{ completedTasks }}
          </div>

          <div
            class="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm"
          >
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M10 3a1 1 0 01.993.883L11 4v5h5a1 1 0 01.117 1.993L16 11h-6V4a1 1 0 011-1z"
              />
              <path
                d="M4 7a2 2 0 00-2 2v5a3 3 0 003 3h6a3 3 0 003-3v-5a2 2 0 00-2-2H4z"
              />
            </svg>
            In Progress: {{ inprogress }}
          </div>

          <div
            class="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm"
          >
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M10 2a1 1 0 01.993.883L11 3v6a1 1 0 01-1 1H4a1 1 0 01-.117-1.993L4 8h5V3a1 1 0 011-1zM14 12a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            Pending: {{ pending }}
          </div>
        </div>
      </div>

      <!-- Right: Breakdown & Legend -->
      <aside class="space-y-4">
        <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="text-sm font-medium text-slate-700">
              Status Breakdown
            </div>
            <div class="text-xs text-slate-400">{{ totalTasks }} tasks</div>
          </div>

          <div class="mt-3 space-y-2">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-green-400"></span>
                <span class="text-slate-700">Completed</span>
              </div>
              <div class="text-slate-800 font-semibold">
                {{ completedTasks }}
              </div>
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-amber-400"></span>
                <span class="text-slate-700">In Progress</span>
              </div>
              <div class="text-slate-800 font-semibold">{{ inprogress }}</div>
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-slate-300"></span>
                <span class="text-slate-700">Pending</span>
              </div>
              <div class="text-slate-800 font-semibold">{{ pending }}</div>
            </div>
          </div>
        </div>

        <!-- <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div class="text-sm font-medium text-slate-700">Quick Filters</div>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <button
              @click="store.selectedPhase = 'Overall'"
              class="py-2 px-3 bg-slate-50 rounded-md text-sm text-slate-700 hover:bg-slate-100"
            >
              Overall
            </button>
            <button
              @click="store.selectedPhase = 'Implementation'"
              class="py-2 px-3 bg-slate-50 rounded-md text-sm text-slate-700 hover:bg-slate-100"
            >
              Implementation
            </button>
            <button
              @click="store.selectedPhase = 'Designing'"
              class="py-2 px-3 bg-slate-50 rounded-md text-sm text-slate-700 hover:bg-slate-100"
            >
              Designing
            </button>
            <button
              @click="store.selectedPhase = 'Testing/QA'"
              class="py-2 px-3 bg-slate-50 rounded-md text-sm text-slate-700 hover:bg-slate-100"
            >
              Testing/QA
            </button>
          </div>
        </div> -->
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useProjectStore } from "../stores/projectStore";
import { useTaskStore } from "../stores/taskStore";

const projectStore = useProjectStore();
const taskStore = useTaskStore();

const project = computed(
  () => projectStore.selectedProject || { name: "No Project", tasks: [] },
);

// Use centralized task store calculations instead of duplicating logic
const stats = computed(() => taskStore.taskStats);

// Create aliases for template readability (all derived from task store)
const totalPoints = computed(() => stats.value.totalPoints);
const completedPoints = computed(() => stats.value.completedPoints);
const totalTasks = computed(() => stats.value.totalTasks);
const completedTasks = computed(() => stats.value.completed);
const inprogress = computed(() => stats.value.inprogress);
const pending = computed(() => stats.value.pending);
const light = computed(() => stats.value.light);
const medium = computed(() => stats.value.medium);
const heavy = computed(() => stats.value.heavy);
const percent = computed(() => stats.value.percent);
const percentDisplay = computed(() => stats.value.percentDisplay);

const titleLabel = computed(() =>
  taskStore.selectedPhase && taskStore.selectedPhase !== "Overall"
    ? `${taskStore.selectedPhase} Progress`
    : "Overall Progress",
);
</script>
