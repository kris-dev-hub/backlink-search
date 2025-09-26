<template>
  <div class="search-input bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Search for backlinks</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="relative">
        <InputText
          v-model="inputValue"
          placeholder="Enter domain name (e.g., example.com)"
          class="w-full text-sm"
          :disabled="loading"
          @input="clearError"
        />
        <Button
          type="submit"
          :disabled="isDisabled"
          class="absolute right-1 top-1/2 transform -translate-y-1/2"
          size="small"
          :loading="loading"
          label="Search"
        />
      </div>

      <div v-if="validationError" class="text-red-600 text-xs mt-2">
        {{ validationError }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  search: [value: string]
}>()

const inputValue = ref('')
const validationError = ref('')

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