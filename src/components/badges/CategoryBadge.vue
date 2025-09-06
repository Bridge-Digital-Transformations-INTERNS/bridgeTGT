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
    return "bg-[#FEF9E7] text-[#E6B84C] border border-[#E6B84C]";
  if (props.category === "medium")
    return "bg-[#FEF5F0] text-[#E67A3F] border border-[#E67A3F]";
  if (props.category === "heavy") return "bg-[#FEF2F2] text-[#D94B4B] border border-[#D94B4B]";
  return "bg-gray-50 text-gray-700 border border-gray-300";
});
</script>
