<template>
  <tr>
    <td class="p-2">{{ task.title }}</td>
    <td class="p-2">{{ task.phase }}</td>
    <td class="p-2 capitalize">{{ task.weight }}</td>
    <td class="p-2">
      <span class="px-2 py-1 rounded text-xs" :class="statusClass">{{ task.status }}</span>
    </td>
    <td class="p-2">{{ task.assignee }}</td>
    <td class="p-2">
      <button @click="$emit('edit', task)" class="text-sm mr-2">Edit</button>
      <button @click="$emit('delete', task)" class="text-sm text-red-600">Delete</button>
    </td>
  </tr>
</template>

<script setup>
const props = defineProps({ task: Object })
import { computed } from 'vue'

const statusClass = computed(() => {
  if (props.task.status === 'inprogress') return 'status-inprogress'
  if (props.task.status === 'completed') return props.task.validated ? 'status-finished-validated' : 'status-finished-not-validated'
  return 'text-gray-600'
})
</script>
