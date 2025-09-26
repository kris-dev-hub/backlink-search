<template>
  <div class="search-input">
    <form @submit.prevent="handleSubmit" class="w-full">
      <div class="relative">
        <input
          v-model="inputValue"
          type="text"
          placeholder="Enter domain name (e.g., example.com)"
          class="input-field text-lg py-4 pr-32"
          :disabled="loading"
          @input="clearError"
        />
        <button
          type="submit"
          :disabled="isDisabled"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 transition-colors rounded-lg font-medium"
          :class="isDisabled ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'btn-primary'"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0l4 4-4 4V4a4 4 0 0 0-4 4H4z"></path>
            </svg>
            Searching...
          </span>
          <span v-else>Search</span>
        </button>
      </div>

      <div v-if="validationError" class="mt-2 text-red-600 text-sm">
        {{ validationError }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  loading?: boolean
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  modelValue: ''
})

const emit = defineEmits<{
  search: [value: string]
  'update:modelValue': [value: string]
}>()

const inputValue = ref(props.modelValue)
const validationError = ref('')

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue || ''
})

// Watch for input changes and emit updates
watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const isDisabled = computed(() => props.loading || !inputValue.value.trim())

const handleSubmit = () => {
  if (props.loading) return

  const trimmedValue = inputValue.value.trim()

  if (!trimmedValue) {
    validationError.value = 'Please enter a domain name'
    return
  }

  if (trimmedValue.length < 3) {
    validationError.value = 'Domain name must be at least 3 characters'
    return
  }

  validationError.value = ''
  emit('search', trimmedValue)
}

const clearError = () => {
  if (validationError.value) {
    validationError.value = ''
  }
}
</script>