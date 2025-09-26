<template>
  <div v-if="domain" class="results-table bg-white border border-gray-200">
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800">Search Results</h3>
      <p class="text-xs text-gray-600 mt-1">Showing backlinks for: <strong>{{ domain }}</strong></p>
    </div>


    <div class="relative">
      <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Custom Table with Column Filters -->
      <div class="overflow-x-auto">
        <table class="w-full text-xs">
          <thead class="bg-gray-50">
            <!-- Header Row -->
            <tr>
              <th class="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200 w-1/4">
                <button @click="onSort('linkUrl')" class="flex items-center gap-1 hover:text-gray-900">
                  Link
                  <i :class="getSortIcon('linkUrl')" class="pi text-xs"></i>
                </button>
              </th>
              <th class="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200 w-1/4">
                <button @click="onSort('pageUrl')" class="flex items-center gap-1 hover:text-gray-900">
                  Source
                  <i :class="getSortIcon('pageUrl')" class="pi text-xs"></i>
                </button>
              </th>
              <th class="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200 w-1/5">
                <button @click="onSort('linkText')" class="flex items-center gap-1 hover:text-gray-900">
                  Anchor
                  <i :class="getSortIcon('linkText')" class="pi text-xs"></i>
                </button>
              </th>
              <th class="px-3 py-2 text-center font-semibold text-gray-700 border-b border-gray-200 w-16">
                <button @click="onSort('noFollow')" class="flex items-center gap-1 hover:text-gray-900">
                  No Follow
                  <i :class="getSortIcon('noFollow')" class="pi text-xs"></i>
                </button>
              </th>
              <th class="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200 w-24">
                IP
              </th>
              <th class="px-3 py-2 text-center font-semibold text-gray-700 border-b border-gray-200 w-12">
                Qty
              </th>
            </tr>

            <!-- Filter Row 1 -->
            <tr class="bg-gray-50">
              <th class="px-3 py-2 border-b border-gray-100">
                <input
                  v-model="columnFilters.linkUrl"
                  @input="onColumnFilter('linkUrl', $event.target.value)"
                  type="text"
                  placeholder="Filter link patterns..."
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </th>
              <th class="px-3 py-2 border-b border-gray-100">
                <input
                  v-model="columnFilters.pageUrl"
                  @input="onColumnFilter('pageUrl', $event.target.value)"
                  type="text"
                  placeholder="Filter source hosts..."
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </th>
              <th class="px-3 py-2 border-b border-gray-100">
                <input
                  v-model="columnFilters.linkText"
                  @input="onColumnFilter('linkText', $event.target.value)"
                  type="text"
                  placeholder="Filter anchors..."
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </th>
              <th class="px-3 py-2 border-b border-gray-100">
                <select
                  v-model="columnFilters.noFollow"
                  @change="onColumnFilter('noFollow', $event.target.value)"
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </th>
              <th class="px-3 py-2 border-b border-gray-100">
                <input
                  v-model="columnFilters.ipString"
                  @input="onColumnFilter('ipString', $event.target.value)"
                  type="text"
                  placeholder="Filter by IP..."
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </th>
              <th class="px-3 py-2 border-b border-gray-100"></th>
            </tr>

            <!-- Filter Row 2 - Additional Paths -->
            <tr class="bg-gray-50">
              <th class="px-3 py-2 border-b border-gray-200">
                <input
                  v-model="columnFilters.linkUrlPath"
                  @input="onColumnFilter('linkUrlPath', $event.target.value)"
                  type="text"
                  placeholder="Additional link paths..."
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </th>
              <th class="px-3 py-2 border-b border-gray-200">
                <input
                  v-model="columnFilters.pageUrlPath"
                  @input="onColumnFilter('pageUrlPath', $event.target.value)"
                  type="text"
                  placeholder="Filter source paths..."
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </th>
              <th class="px-3 py-2 border-b border-gray-200"></th>
              <th class="px-3 py-2 border-b border-gray-200"></th>
              <th class="px-3 py-2 border-b border-gray-200"></th>
              <th class="px-3 py-2 border-b border-gray-200"></th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="links.length === 0 && !loading" class="border-b border-gray-100">
              <td colspan="6" class="px-3 py-8 text-center text-gray-500">
                <i class="pi pi-search text-2xl text-gray-400 mb-2 block"></i>
                {{ domain ? 'No backlinks found for this domain.' : 'Enter a domain to search for backlinks.' }}
              </td>
            </tr>

            <tr v-for="link in links" :key="link.linkUrl + link.pageUrl" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-3 py-2">
                <div
                  :title="link.linkUrl"
                  class="text-blue-600 hover:text-blue-800 cursor-pointer truncate"
                  @click="openUrl(link.linkUrl)"
                >
                  {{ link.linkUrlShort || link.linkUrl }}
                </div>
              </td>
              <td class="px-3 py-2">
                <div
                  :title="link.pageUrl"
                  class="text-gray-700 hover:text-gray-900 cursor-pointer truncate"
                  @click="openUrl(link.pageUrl)"
                >
                  {{ link.pageUrlShort || link.pageUrl }}
                </div>
              </td>
              <td class="px-3 py-2">
                <div :title="link.linkText" class="text-gray-600 truncate">
                  {{ link.linkTextShort || link.linkText || '-' }}
                </div>
              </td>
              <td class="px-3 py-2 text-center">
                <i v-if="link.noFollow" class="pi pi-check text-green-600"></i>
                <i v-else class="pi pi-times text-red-600"></i>
              </td>
              <td class="px-3 py-2 text-gray-600 font-mono text-xs">
                {{ link.ipString || '-' }}
              </td>
              <td class="px-3 py-2 text-center font-medium text-gray-800">
                {{ link.qty || 1 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
import { computed, ref } from 'vue'
import type { LinksData } from '../types/links'

interface Props {
  links: LinksData[]
  loading: boolean
  errorMessage: string
  domain: string
  currentPage: number
  rowsPerPage: number
  totalRecords: number
  sortBy: string
  sortType: 'asc' | 'desc'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:rowsPerPage': [rows: number]
  'update:filters': [filters: { name: string; val: string; kind: string }[]]
  'sort': [column: string]
}>()

// Column filters
const columnFilters = ref({
  linkUrl: '',
  linkUrlPath: '',
  pageUrl: '',
  pageUrlPath: '',
  linkText: '',
  noFollow: '',
  dateFrom: '',
  dateTo: '',
  ipString: ''
})

let debounceTimeout = 0

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

const onColumnFilter = (column: string, value: string) => {
  // Clear previous timeout
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  // Update the column filter
  columnFilters.value[column as keyof typeof columnFilters.value] = value

  // Set debounced update
  debounceTimeout = setTimeout(() => {
    const activeFilters = []

    // Convert column filters to API format
    // For link filters, combine both inputs with OR logic since API only has Link Path
    const linkFilters = []
    if (columnFilters.value.linkUrl) {
      linkFilters.push(columnFilters.value.linkUrl)
    }
    if (columnFilters.value.linkUrlPath) {
      linkFilters.push(columnFilters.value.linkUrlPath)
    }
    if (linkFilters.length > 0) {
      // Combine search terms with | (OR) for regex pattern
      const combinedPattern = linkFilters.join('|')
      activeFilters.push({ name: 'Link Path', val: combinedPattern, kind: 'any' })
    }
    if (columnFilters.value.pageUrl) {
      activeFilters.push({ name: 'Source Host', val: columnFilters.value.pageUrl, kind: 'any' })
    }
    if (columnFilters.value.pageUrlPath) {
      activeFilters.push({ name: 'Source Path', val: columnFilters.value.pageUrlPath, kind: 'any' })
    }
    if (columnFilters.value.linkText) {
      activeFilters.push({ name: 'Anchor', val: columnFilters.value.linkText, kind: 'any' })
    }
    if (columnFilters.value.noFollow) {
      activeFilters.push({ name: 'No Follow', val: columnFilters.value.noFollow, kind: 'exact' })
    }
    if (columnFilters.value.ipString) {
      activeFilters.push({ name: 'IP', val: columnFilters.value.ipString, kind: 'any' })
    }

    emit('update:filters', activeFilters)
  }, 300)
}

const onSort = (column: string) => {
  emit('sort', column)
}

const getSortIcon = (column: string) => {
  if (props.sortBy !== column) return 'pi-sort'
  return props.sortType === 'asc' ? 'pi-sort-up' : 'pi-sort-down'
}
</script>

