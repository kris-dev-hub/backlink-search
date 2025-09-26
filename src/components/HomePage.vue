<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FilterData, LinksData } from '../types/links.ts'
import { LinksService } from '../services/links.ts'
import SearchInput from './SearchInput.vue'
import ResultsTable from './ResultsTable.vue'

const links = ref<LinksData[]>([])
const domain = ref('')
const loading = ref(false)
const errorMessage = ref('')

const currentPage = ref(1)
const rowsPerPage = ref(25)
const totalRecords = ref(0)

const filtersData = ref<FilterData[]>([])
const sortBy = ref('default')
const sortType = ref<'asc' | 'desc'>('asc')

let debounceTimeout = 0

const route = useRoute()
const router = useRouter()

let canonicalLink: HTMLLinkElement | null = null

// Handle route parameters on mount
onMounted(() => {
  const routeDomain = route.params.domain as string
  if (routeDomain) {
    onSearch(routeDomain)
  }

  // Add canonical link for SEO
  canonicalLink = document.createElement('link')
  canonicalLink.rel = 'canonical'
  canonicalLink.href = window.location.origin + '/'
  document.head.appendChild(canonicalLink)
})

// Cleanup on unmount
onUnmounted(() => {
  if (canonicalLink && canonicalLink.parentNode) {
    canonicalLink.parentNode.removeChild(canonicalLink)
  }
})

const onSearch = async (searchDomain: string) => {
  domain.value = searchDomain
  currentPage.value = 1
  await loadFromServer()
}

const loadFromServer = async () => {
  if (!domain.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    const data = await LinksService.getLinksList(
      domain.value,
      currentPage.value,
      rowsPerPage.value,
      sortBy.value,
      sortType.value,
      filtersData.value
    )

    if ('error' in data) {
      errorMessage.value = data.error
      links.value = []
      // Update URL to search page on error
      updateUrlForSearchResult(false)
      return
    }

    // Process the data
    for (let i = 0; i < data.length; i++) {
      data[i].ipString = data[i].ip.join(', ')
      if (data[i].linkText != undefined) {
        data[i].linkTextShort = truncatedText(data[i].linkText, 30)
      }
      if (data[i].linkUrl != undefined) {
        data[i].linkUrlShort = truncatedText(data[i].linkUrl, 90)
      }
      if (data[i].pageUrl != undefined) {
        data[i].pageUrlShort = truncatedText(data[i].pageUrl, 90)
      }
    }

    links.value = data

    // Update URL to domain page on success
    updateUrlForSearchResult(true)

    // Calculate total records for pagination
    if (data.length < rowsPerPage.value) {
      totalRecords.value = (currentPage.value - 1) * rowsPerPage.value + data.length
    } else {
      totalRecords.value = currentPage.value * rowsPerPage.value + 1
    }

  } catch (error) {
    errorMessage.value = 'Failed to load data. Please try again.'
    links.value = []
    // Update URL to search page on error
    updateUrlForSearchResult(false)
  } finally {
    loading.value = false
  }
}

const onFiltersUpdate = (newFilters: FilterData[]) => {
  filtersData.value = newFilters
  currentPage.value = 1

  // Clear the previous timeout if it exists
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  // Set a new timeout for debounced search
  debounceTimeout = setTimeout(() => {
    loadFromServer()
  }, 500) // 500ms delay
}

const onPageUpdate = (newPage: number) => {
  currentPage.value = newPage
  loadFromServer()
}

const onRowsPerPageUpdate = (newRowsPerPage: number) => {
  rowsPerPage.value = newRowsPerPage
  currentPage.value = 1
  loadFromServer()
}

const onSort = (column: string) => {
  if (sortBy.value === column) {
    sortType.value = sortType.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortType.value = 'asc'
  }
  currentPage.value = 1
  loadFromServer()
}

const updateUrlForSearchResult = (success: boolean) => {
  if (success && domain.value) {
    // Update URL to domain page on successful search
    const newPath = `/dev/backlink-search/domain/${encodeURIComponent(domain.value)}`
    if (route.path !== newPath) {
      router.replace(newPath)
    }
  } else {
    // Update URL to search page on error or no domain
    const searchPath = '/dev/backlink-search'
    if (route.path !== searchPath) {
      router.replace(searchPath)
    }
  }
}

const truncatedText = (text: string, length: number) => {
  return text.length <= length
    ? text
    : text.substring(0, length - 3) + '...'
}
</script>

<template>
  <div class="min-h-screen">
    <header class="bg-white border-b border-gray-200 px-6 py-6">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Backlink Search
        </h1>
        <p class="text-xl text-gray-600">
          Discover backlinks pointing to any domain
        </p>
      </div>
    </header>

    <div class="px-6 py-6">
      <!-- Search Input -->
      <div class="max-w-4xl mx-auto mb-6">
        <SearchInput
          v-model="domain"
          :loading="loading"
          @search="onSearch"
        />

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-800 text-sm font-medium">{{ errorMessage }}</p>
          </div>
        </div>

      </div>

      <!-- Results Table - Full Width -->
      <ResultsTable
        :links="links"
        :loading="loading"
        :error-message="errorMessage"
        :domain="domain"
        :current-page="currentPage"
        :rows-per-page="rowsPerPage"
        :total-records="totalRecords"
        :sort-by="sortBy"
        :sort-type="sortType"
        @update:current-page="onPageUpdate"
        @update:rows-per-page="onRowsPerPageUpdate"
        @update:filters="onFiltersUpdate"
        @sort="onSort"
      />
    </div>
  </div>
</template>

