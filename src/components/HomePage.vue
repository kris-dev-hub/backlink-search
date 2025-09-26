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

const truncatedText = (text: string, length: number) => {
  return text.length <= length
    ? text
    : text.substring(0, length - 3) + '...'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Backlink Search</h1>
        <p class="mt-2 text-sm text-gray-600">
          Discover backlinks pointing to any domain with advanced filtering capabilities
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Description Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <p class="text-sm text-gray-700 leading-relaxed">
          Introducing new backlink search tool designed for SEO enthusiasts and
          website owners. This user-friendly tool offers the unique capability to
          search for backlinks by specific domains. It's an ideal solution for
          those looking to enhance their SEO strategies by understanding where
          their or competitors' backlinks are coming from. The best part? It's
          free, with some limitations in place. This accessibility ensures that
          even beginners or those on a tight budget can start optimizing their
          backlink strategy effectively. Dive into a new world of optimization and
          give your website the visibility it deserves!
        </p>
      </div>

      <!-- Search Input -->
      <div class="mb-6">
        <SearchInput
          :loading="loading"
          @search="onSearch"
        />
      </div>

      <!-- Filter Panel -->
      <div class="mb-6">
        <FilterPanel
          v-model="filtersData"
          :domain="domain"
          @update:modelValue="onFiltersUpdate"
        />
      </div>

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
      />
    </main>
  </div>
</template>

