<template>
  <span
    :class="[
      'px-2 py-1 rounded-full text-xs font-medium',
      badgeColor
    ]"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  status: String,
  validated: { type: Boolean, default: false }
})

const label = computed(() => {
  if (props.status === "completed") {
    return props.validated ? "Completed - Validated" : "Completed - Not Validated"
  }
  return {
    pending: "Pending",
    inprogress: "In Progress",
  }[props.status] || props.status
})

const badgeColor = computed(() => {
  if (props.status === "pending") return "bg-[var(--color-sticky)] text-[var(--color-cacao)]"
  if (props.status === "inprogress") return "bg-[var(--color-powder)] text-[var(--color-cacao)]"
  if (props.status === "completed" && props.validated)
    return "bg-[var(--color-palm)] text-white"
  if (props.status === "completed" && !props.validated)
    return "bg-[var(--color-lime)] text-[var(--color-cacao)]"
  return "bg-gray-200 text-gray-700"
})
</script>
