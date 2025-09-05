<template>
  <div class="fixed inset-0 bg-black/30 flex items-center justify-center">
    <div class="bg-white p-4">
      <h2>Add Task</h2>
      <input v-model="name" placeholder="Task name" />
      <select v-model="phase">
        <option v-for="p in project?.phases" :key="p">{{ p }}</option>
      </select>
      <input v-model="category" placeholder="Category" />
      <select v-model="status">
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
      <input v-model="date" type="date" />
      <input v-model="assignee" placeholder="Assignee" />

      <button @click="add">Save</button>
      <button @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/useProjectStore'
import { useTaskStore } from '@/stores/useTaskStore'

const props = defineProps({ projectId: String })
const emit = defineEmits(["close"])

const name = ref("")
const phase = ref("")
const category = ref("")
const status = ref("Pending")
const date = ref("")
const assignee = ref("")

const projectStore = useProjectStore()
const taskStore = useTaskStore()

const project = computed(() => projectStore.getProjectById(props.projectId))

const add = () => {
  if (props.projectId && name.value) {
    taskStore.addTask(props.projectId, {
      name: name.value,
      phase: phase.value,
      category: category.value,
      status: status.value,
      date: date.value,
      assignee: assignee.value
    })
    emit('close')
  }
}
</script>
