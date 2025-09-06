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
    return "bg-[#E6B84C] text-white";
  if (props.category === "medium")
    return "bg-[#E67A3F] text-white";
  if (props.category === "heavy") return "bg-[#D94B4B] text-white";
  return "bg-gray-200 text-gray-700";
});
</script>
