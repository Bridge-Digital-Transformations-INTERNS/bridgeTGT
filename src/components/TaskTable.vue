<template>
  <table class="w-full border">
    <thead>
      <tr>
        <th>Task</th>
        <th>Phase</th>
        <th>Category</th>
        <th>Status</th>
        <th>Date</th>
        <th>Assignee</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="task in tasks" :key="task.id">
        <td>{{ task.name }}</td>
        <td>{{ task.phase }}</td>
        <td>{{ task.category }}</td>
        <td>{{ task.status }}</td>
        <td>{{ task.date }}</td>
        <td>{{ task.assignee }}</td>
        <td>
          <button @click="$emit('edit', task.id)">Edit</button>
          <button @click="$emit('delete', task.id)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({ tasks: Array })
defineEmits(["edit", "delete"])
</script>
