<template>
  <Modal :open="open" :title="isEdit ? 'Edit Task' : 'Add Task'" @cancel="close" @confirm="save">
    <div class="flex flex-col gap-3">
      <div>
        <label class="text-sm font-medium">Task Title</label>
        <input v-model="form.title" class="p-2 border rounded w-full" placeholder="Task name" />
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
        <input v-model="form.assignee" class="p-2 border rounded w-full" placeholder="Assignee" />
      </div>
    </div>
  </Modal>
</template>

<script setup>
import Modal from './ModalCom.vue'
import { ref, watch } from 'vue'

const props = defineProps({ open: Boolean, isEdit: Boolean, initial: Object })
const emits = defineEmits(['close', 'save'])

const form = ref({ title: '', phase: 'Planning', weight: 'light', status: 'pending', assignee: '' })

watch(() => props.initial, (val) => {
  form.value = val ? { ...val } : { title: '', phase: 'Planning', weight: 'light', status: 'pending', assignee: '' }
}, { immediate: true })

function close() { emits('close') }
function save() { emits('save', { ...form.value }) }
</script>
