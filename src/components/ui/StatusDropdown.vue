<template>
  <div class="relative" ref="dropdownContainer">
    <!-- Custom trigger that looks like a badge -->
    <button
      @click="toggleDropdown"
      :class="[
        'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-flex items-center gap-2 border transition-colors',
        'hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1',
        statusConfig.bgClass,
        statusConfig.textClass,
        statusConfig.borderClass
      ]"
    >
      {{ statusConfig.label }}
      <svg
        class="w-3 h-3 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      ref="dropdownMenu"
      :class="[
        'absolute left-0 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden',
        dropdownPosition === 'above' ? 'bottom-full mb-1' : 'top-full mt-1'
      ]"
    >
      <div class="py-1">
        <button
          v-for="option in statusOptions"
          :key="option.value"
          @click="selectStatus(option.value)"
          :class="[
            'w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors',
            'flex items-center gap-2',
            option.value === currentValue ? 'bg-slate-50 font-medium' : ''
          ]"
        >
          <span
            :class="[
              'w-2 h-2 rounded-full border',
              getStatusConfig(option.value).borderClass
            ]"
          ></span>
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Backdrop to close dropdown -->
    <div
      v-if="isOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  validated: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:value'])

const isOpen = ref(false)
const dropdownContainer = ref(null)
const dropdownMenu = ref(null)
const dropdownPosition = ref('below')

// Status options for the dropdown
const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'completed-validated', label: 'Validated' }
]

// Get the current display value
const currentValue = computed(() => {
  if (props.value === 'completed') {
    return props.validated ? 'completed-validated' : 'completed'
  }
  return props.value
})

// Status configuration with colors
const statusConfig = computed(() => {
  return getStatusConfig(currentValue.value)
})

function getStatusConfig(status) {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        bgClass: 'bg-white',
        textClass: 'text-[var(--status-pending-text)]',
        borderClass: 'border-[var(--status-pending-border)]'
      }
    case 'inprogress':
      return {
        label: 'In Progress',
        bgClass: 'bg-white',
        textClass: 'text-[var(--status-inprogress-text)]',
        borderClass: 'border-[var(--status-inprogress-border)]'
      }
    case 'completed':
      return {
        label: 'Completed',
        bgClass: 'bg-white',
        textClass: 'text-[var(--status-completed-text)]',
        borderClass: 'border-[var(--status-completed-border)]'
      }
    case 'completed-validated':
      return {
        label: 'Validated',
        bgClass: 'bg-white',
        textClass: 'text-[var(--status-validated-text)]',
        borderClass: 'border-[var(--status-validated-border)]'
      }
    default:
      return {
        label: 'Unknown',
        bgClass: 'bg-white',
        textClass: 'text-gray-600',
        borderClass: 'border-gray-300'
      }
  }
}

function calculateDropdownPosition() {
  if (!dropdownContainer.value || !dropdownMenu.value) return

  const containerRect = dropdownContainer.value.getBoundingClientRect()
  const menuHeight = dropdownMenu.value.offsetHeight
  const viewportHeight = window.innerHeight

  // Calculate space below and above the trigger
  const spaceBelow = viewportHeight - containerRect.bottom
  const spaceAbove = containerRect.top

  // If there's not enough space below but enough space above, position above
  if (spaceBelow < menuHeight + 10 && spaceAbove > menuHeight + 10) {
    dropdownPosition.value = 'above'
  } else {
    dropdownPosition.value = 'below'
  }
}

function toggleDropdown() {
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    nextTick(() => {
      calculateDropdownPosition()
    })
  }
}

function closeDropdown() {
  isOpen.value = false
}

function selectStatus(value) {
  const isCompleted = value === 'completed' || value === 'completed-validated'
  const isValidated = value === 'completed-validated'

  emit('update:value', {
    status: isCompleted ? 'completed' : value,
    validated: isValidated
  })

  closeDropdown()
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (!event.target.closest('.relative')) {
    closeDropdown()
  }
}

// Recalculate position on scroll or resize
function handleScrollOrResize() {
  if (isOpen.value) {
    calculateDropdownPosition()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScrollOrResize, true)
  window.addEventListener('resize', handleScrollOrResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScrollOrResize, true)
  window.removeEventListener('resize', handleScrollOrResize)
})
</script>
