<template>
  <div class="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
    <!-- Items info -->
    <div class="flex items-center text-sm text-slate-700">
      <span>
        Showing {{ paginationInfo.startItem }} to {{ paginationInfo.endItem }} of {{ paginationInfo.totalItems }} results
      </span>
    </div>

    <!-- Pagination controls -->
    <div class="flex items-center space-x-2">
      <!-- Previous button -->
      <button
        @click="prevPage"
        :disabled="!paginationInfo.hasPrevPage"
        class="px-3 py-1 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        Previous
      </button>

      <!-- Page numbers -->
      <div class="flex items-center space-x-1">
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="page !== '...'"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md',
              page === paginationInfo.currentPage
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
            ]"
          >
            {{ page }}
          </button>
          <span v-else class="px-2 text-slate-500">...</span>
        </template>
      </div>

      <!-- Next button -->
      <button
        @click="nextPage"
        :disabled="!paginationInfo.hasNextPage"
        class="px-3 py-1 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  paginationInfo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['goToPage', 'prevPage', 'nextPage'])

// Calculate visible page numbers
const visiblePages = computed(() => {
  const { currentPage, totalPages } = props.paginationInfo
  const pages = []

  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }
  }

  return pages
})

function goToPage(page) {
  emit('goToPage', page)
}

function prevPage() {
  emit('prevPage')
}

function nextPage() {
  emit('nextPage')
}
</script>
