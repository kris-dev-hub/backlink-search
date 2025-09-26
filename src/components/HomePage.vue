<script setup lang="ts">
import { ref, watch } from 'vue'
import { FilterData, LinksData } from '../types/links.ts'
import { LinksService } from '../services/links.ts'
import SearchInput from './SearchInput.vue'
import FilterPanel from './FilterPanel.vue'
import ResultsTable from './ResultsTable.vue'

const links = ref<LinksData[]>([])
const domain = ref('')
const loading = ref(false)
const errorMessage = ref('')

const currentPage = ref(1)
const rowsPerPage = ref(25)
const totalRecords = ref(0)

const filtersData = ref<FilterData[]>([])

let debounceTimeout = 0

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
      'default',
      'asc',
      filtersData.value
    )

    if ('error' in data) {
      errorMessage.value = data.error
      links.value = []
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

    // Calculate total records for pagination
    if (data.length < rowsPerPage.value) {
      totalRecords.value = (currentPage.value - 1) * rowsPerPage.value + data.length
    } else {
      totalRecords.value = currentPage.value * rowsPerPage.value + 1
    }

  } catch (error) {
    errorMessage.value = 'Failed to load data. Please try again.'
    links.value = []
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

const truncatedText = (text: string, length: number) => {
  return text.length <= length
    ? text
    : text.substring(0, length - 3) + '...'
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">
        Backlink Search
      </h1>
      <p class="text-xl text-gray-600">
        Discover backlinks pointing to any domain
      </p>
    </header>

    <div class="max-w-6xl mx-auto">
      <!-- Search Input -->
      <SearchInput
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

      <!-- Filter Panel -->
      <FilterPanel
        v-model="filtersData"
        :domain="domain"
        @update:modelValue="onFiltersUpdate"
        class="mt-6"
      />

      <!-- Results Table -->
      <ResultsTable
        :links="links"
        :loading="loading"
        :error-message="errorMessage"
        :domain="domain"
        :current-page="currentPage"
        :rows-per-page="rowsPerPage"
        :total-records="totalRecords"
        @update:current-page="onPageUpdate"
        @update:rows-per-page="onRowsPerPageUpdate"
        class="mt-8"
      />
    </div>
  </div>
</template>

