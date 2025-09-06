<template>
  <tr>
    <td class="p-2 align-middle">{{ task.title }}</td>
    <td class="p-2 align-middle">{{ task.phase }}</td>
    <td class="p-2 align-middle capitalize">{{ task.weight }}</td>
    <td class="p-2 align-middle">
      <span class="px-2 py-1 rounded text-xs" :class="statusClass">{{ task.status }}</span>
    </td>
    <td class="p-2 align-middle">{{ task.assignee }}</td>
    <td class="p-2 align-middle">
      <button @click="$emit('edit', task)" class="text-sm mr-2">Edit</button>
      <button @click="$emit('delete', task)" class="text-sm text-red-600">Delete</button>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ task: Object })

const statusClass = computed(() => {
  if (props.task.status === 'inprogress') return 'status-inprogress'
  if (props.task.status === 'completed') return props.task.validated ? 'status-finished-validated' : 'status-finished-not-validated'
  return 'text-gray-600'
})
</script>
