<template>
  <span
    :class="[
      'px-2 py-1 rounded-full text-xs font-medium capitalize',
      badgeColor,
    ]"
  >
    {{ category }}
  </span>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({ category: String });

const badgeColor = computed(() => {
  if (props.category === "light")
    return "bg-[var(--color-cream)] text-[var(--color-cacao)]";
  if (props.category === "medium")
    return "bg-[var(--color-sticky)] text-[var(--color-cacao)]";
  if (props.category === "heavy") return "bg-[var(--color-cacao)] text-white";
  return "bg-gray-200 text-gray-700";
});
</script>
