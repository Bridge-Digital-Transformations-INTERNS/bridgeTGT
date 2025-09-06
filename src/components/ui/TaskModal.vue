<template>
  <Modal
    :open="open"
    :title="isEdit ? 'Edit Task' : 'Add Task'"
    @cancel="close"
    @confirm="save"
  >
    <div class="flex flex-col gap-6">
      <!-- General Info Section -->
      <div>
        <h3 class="text-slate-700 font-semibold mb-3">General Information</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="text-sm font-medium">Task Title</label>
            <input
              v-model="form.title"
              class="p-2 border rounded w-full"
              placeholder="Task name"
            />
          </div>

          <div>
            <label class="text-sm font-medium">Phase</label>
            <select v-model="form.phase" class="p-2 border rounded w-full">
              <option>Planning</option>
              <option>Analysis</option>
              <option>Designing</option>
              <option>Implementation</option>
              <option>Testing/QA</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium">Weight</label>
            <select v-model="form.weight" class="p-2 border rounded w-full">
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium">Status</label>
            <select v-model="form.status" class="p-2 border rounded w-full">
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium">Assignee</label>
            <input
              v-model="form.assignee"
              class="p-2 border rounded w-full"
              placeholder="Assignee"
            />
          </div>
        </div>
      </div>

      <!-- Schedule Section -->
      <div>
        <h3 class="text-slate-700 font-semibold mb-3">Schedule</h3>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="text-sm font-medium">Start Date</label>
            <input
              type="date"
              v-model="form.startDate"
              class="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label class="text-sm font-medium">Target Date</label>
            <input
              type="date"
              v-model="form.targetDate"
              class="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label class="text-sm font-medium">End Date</label>
            <input
              type="date"
              v-model="form.endDate"
              class="p-2 border rounded w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import Modal from "./ModalCom.vue";
import { ref, watch } from "vue";

const props = defineProps({ open: Boolean, isEdit: Boolean, initial: Object });
const emits = defineEmits(["close", "save"]);

const emptyForm = {
  title: "",
  phase: "Planning",
  weight: "light",
  status: "pending",
  assignee: "",
  startDate: "",
  targetDate: "",
  endDate: "",
};

const form = ref({ ...emptyForm });

watch(
  () => props.initial,
  (val) => {
    form.value = val ? { ...emptyForm, ...val } : { ...emptyForm };
  },
  { immediate: true },
);

function close() {
  emits("close");
}
function save() {
  emits("save", { ...form.value });
}
</script>
