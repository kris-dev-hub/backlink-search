<template>
  <div v-if="showFilters" class="filter-panel bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Mobile Toggle Button -->
    <button
      @click="toggleExpanded"
      class="w-full p-4 text-left flex items-center justify-between lg:hidden border-b border-gray-200"
    >
      <div class="flex items-center space-x-2">
        <span class="font-medium text-gray-700 text-sm">Filters</span>
        <div class="text-xs text-gray-500">
          {{ filterSummary }}
        </div>
      </div>
      <i :class="{ 'pi-chevron-up': isExpanded, 'pi-chevron-down': !isExpanded }"
         class="pi text-gray-400 transition-transform text-sm"></i>
    </button>

    <!-- Filter Content -->
    <div
      :style="{ display: isExpanded || isDesktop ? 'block' : 'none' }"
      class="p-4 space-y-4"
    >
      <div class="flex flex-col sm:flex-row gap-4 items-end">
        <div class="flex-1">
          <label class="block text-xs font-medium text-gray-700 mb-1">
            Filter Field
          </label>
          <select
            v-model="localFilters.field"
            class="filter-select w-full text-xs"
            @change="onFilterFieldChange"
          >
            <option v-for="option in filterOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div v-if="showFilterValue" class="flex-1">
          <label class="block text-xs font-medium text-gray-700 mb-1">
            Filter Value
          </label>
          <input
            v-if="isTextFilter"
            v-model="localFilters.value"
            type="text"
            placeholder="Enter filter value (use quotes for exact match)"
            class="input-field w-full text-xs"
            @input="onFilterValueChange"
          />
          <select
            v-else-if="isBooleanFilter"
            v-model="localFilters.value"
            class="filter-select w-full text-xs"
            @change="onFilterValueChange"
          >
            <option value="">Select value</option>
            <option v-for="option in booleanOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="flex gap-2">
          <button
            v-if="hasActiveFilter"
            @click="clearFilters"
            class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition-colors"
          >
            <i class="pi pi-times mr-1"></i>
            Clear
          </button>
        </div>
      </div>

      <div v-if="localFilters.field && localFilters.value" class="text-xs text-gray-600 bg-gray-50 p-2 rounded">
        <strong>Active Filter:</strong> {{ getFilterDescription() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { FilterData } from '../types/links'

interface Props {
  modelValue: FilterData[]
  domain: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: FilterData[]]
}>()

const isExpanded = ref(false)
const isDesktop = ref(window.innerWidth >= 1024)

const localFilters = ref({
  field: '',
  value: '',
  kind: 'any' as 'any' | 'exact'
})

const filterOptions = [
  { label: 'Disable', value: '' },
  { label: 'Link Path', value: 'Link Path' },
  { label: 'Source Host', value: 'Source Host' },
  { label: 'Source Path', value: 'Source Path' },
  { label: 'Anchor', value: 'Anchor' },
  { label: 'No Follow', value: 'No Follow' }
]

const booleanOptions = [
  { label: 'Yes', value: '1' },
  { label: 'No', value: '0' }
]

const showFilters = computed(() => props.domain !== '')
const showFilterValue = computed(() => localFilters.value.field && localFilters.value.field !== '')
const isTextFilter = computed(() => {
  return ['Link Path', 'Source Host', 'Source Path', 'Anchor'].includes(localFilters.value.field)
})
const isBooleanFilter = computed(() => localFilters.value.field === 'No Follow')
const hasActiveFilter = computed(() => localFilters.value.field && localFilters.value.value)

const filterSummary = computed(() => {
  if (!hasActiveFilter.value) return 'No filters'
  return `${localFilters.value.field}: ${localFilters.value.value}`
})

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const onFilterFieldChange = () => {
  localFilters.value.value = ''
  localFilters.value.kind = 'any'
  updateFilters()
}

const onFilterValueChange = () => {
  if (localFilters.value.value.startsWith('"') && localFilters.value.value.endsWith('"')) {
    localFilters.value.kind = 'exact'
  } else {
    localFilters.value.kind = 'any'
  }
  updateFilters()
}

const clearFilters = () => {
  localFilters.value = {
    field: '',
    value: '',
    kind: 'any'
  }
  updateFilters()
}

const updateFilters = () => {
  if (!localFilters.value.field || !localFilters.value.value) {
    emit('update:modelValue', [])
  } else {
    let value = localFilters.value.value
    if (localFilters.value.kind === 'exact' && value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1)
    }

    emit('update:modelValue', [{
      name: localFilters.value.field,
      val: value,
      kind: localFilters.value.kind
    }])
  }
}

const getFilterDescription = () => {
  let desc = `${localFilters.value.field} contains "${localFilters.value.value}"`
  if (localFilters.value.kind === 'exact') {
    desc = `${localFilters.value.field} exactly matches "${localFilters.value.value}"`
  }
  return desc
}

// Handle window resize
onMounted(() => {
  const handleResize = () => {
    isDesktop.value = window.innerWidth >= 1024
  }
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
})

// Initialize from props
watch(() => props.modelValue, (newValue) => {
  if (!newValue || newValue.length === 0) {
    localFilters.value = { field: '', value: '', kind: 'any' }
  } else {
    const filter = newValue[0]
    localFilters.value = {
      field: filter.name,
      value: filter.val,
      kind: filter.kind
    }
  }
}, { immediate: true })
</script>