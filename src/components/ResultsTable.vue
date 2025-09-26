<template>
  <div v-if="domain" class="results-table bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800">Search Results</h3>
      <p class="text-xs text-gray-600 mt-1">Showing backlinks for: <strong>{{ domain }}</strong></p>
    </div>

    <div v-if="errorMessage" class="p-4 text-red-600 text-sm bg-red-50 border-l-4 border-red-500">
      {{ errorMessage }}
    </div>

    <div class="relative">
      <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <ProgressSpinner class="w-8 h-8" />
      </div>

      <DataTable
        :value="links"
        :loading="loading"
        class="table-dense text-xs"
        :paginator="false"
        scrollable
        scrollHeight="600px"
        :rowClass="() => 'text-xs'"
      >
        <Column field="linkUrlShort" header="Link" class="text-xs" :style="{ width: '25%' }">
          <template #body="{ data }">
            <div
              :title="data.linkUrl"
              class="text-xs text-blue-600 hover:text-blue-800 cursor-pointer truncate"
              @click="openUrl(data.linkUrl)"
            >
              {{ data.linkUrlShort || data.linkUrl }}
            </div>
          </template>
        </Column>

        <Column field="pageUrlShort" header="Source" class="text-xs" :style="{ width: '25%' }">
          <template #body="{ data }">
            <div
              :title="data.pageUrl"
              class="text-xs text-gray-700 hover:text-gray-900 cursor-pointer truncate"
              @click="openUrl(data.pageUrl)"
            >
              {{ data.pageUrlShort || data.pageUrl }}
            </div>
          </template>
        </Column>

        <Column field="linkTextShort" header="Anchor" class="text-xs" :style="{ width: '20%' }">
          <template #body="{ data }">
            <div
              :title="data.linkText"
              class="text-xs text-gray-600 truncate"
            >
              {{ data.linkTextShort || data.linkText || '-' }}
            </div>
          </template>
        </Column>

        <Column field="noFollow" header="No Follow" class="text-xs text-center" :style="{ width: '8%' }">
          <template #body="{ data }">
            <i v-if="data.noFollow" class="pi pi-check text-green-600 text-xs"></i>
            <i v-else class="pi pi-times text-red-600 text-xs"></i>
          </template>
        </Column>

        <Column field="dateFrom" header="First Seen" class="text-xs text-center" :style="{ width: '8%' }">
          <template #body="{ data }">
            <span class="text-xs text-gray-600">{{ formatDate(data.dateFrom) }}</span>
          </template>
        </Column>

        <Column field="dateTo" header="Last Seen" class="text-xs text-center" :style="{ width: '8%' }">
          <template #body="{ data }">
            <span class="text-xs text-gray-600">{{ formatDate(data.dateTo) }}</span>
          </template>
        </Column>

        <Column field="ipString" header="IP" class="text-xs" :style="{ width: '12%' }">
          <template #body="{ data }">
            <span class="text-xs text-gray-600 font-mono">{{ data.ipString || '-' }}</span>
          </template>
        </Column>

        <Column field="qty" header="Qty" class="text-xs text-center" :style="{ width: '6%' }">
          <template #body="{ data }">
            <span class="text-xs font-medium text-gray-800">{{ data.qty || 1 }}</span>
          </template>
        </Column>

        <template #empty>
          <div class="text-center py-8 text-gray-500 text-sm">
            <i class="pi pi-search text-2xl text-gray-400 mb-2 block"></i>
            {{ domain ? 'No backlinks found for this domain.' : 'Enter a domain to search for backlinks.' }}
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Custom Pagination -->
    <div v-if="links.length > 0" class="p-4 border-t border-gray-200 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="text-xs text-gray-600">
          Showing {{ ((currentPage - 1) * rowsPerPage) + 1 }} to {{ Math.min(currentPage * rowsPerPage, totalRecords) }}
          of {{ totalRecords }} results
        </div>

        <div class="flex items-center gap-2">
          <label class="text-xs text-gray-600">Rows per page:</label>
          <select
            :value="rowsPerPage"
            @change="$emit('update:rowsPerPage', Number(($event.target as HTMLSelectElement).value))"
            class="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="goToPreviousPage"
          :disabled="currentPage <= 1"
          class="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="pi pi-chevron-left mr-1"></i>
          Previous
        </button>

        <span class="text-xs text-gray-600 px-2">
          Page {{ currentPage }}
        </span>

        <button
          @click="goToNextPage"
          :disabled="isLastPage"
          class="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <i class="pi pi-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LinksData } from '../types/links'

interface Props {
  links: LinksData[]
  loading: boolean
  errorMessage: string
  domain: string
  currentPage: number
  rowsPerPage: number
  totalRecords: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:rowsPerPage': [rows: number]
}>()

const isLastPage = computed(() => {
  return props.currentPage * props.rowsPerPage >= props.totalRecords
})

const goToPreviousPage = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

const goToNextPage = () => {
  if (!isLastPage.value) {
    emit('update:currentPage', props.currentPage + 1)
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    })
  } catch {
    return dateStr
  }
}

const openUrl = (url: string) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
</script>

<style scoped>
:deep(.p-datatable) {
  font-size: 0.75rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f8fafc;
}

:deep(.p-datatable .p-datatable-scrollable-body) {
  overflow-x: auto;
}
</style>