<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Header /*, Item */, ServerOptions } from 'vue3-easy-data-table'
import { LinksData } from '../types/links.ts'
import { LinksService } from '../services/links.ts'

const headers: Header[] = [
  { text: 'Link', value: 'link_url' },
  { text: 'Source', value: 'page_url' },
  { text: 'Anchor', value: 'link_text' },
  { text: 'No follow', value: 'no_follow' },
  { text: 'First Seen', value: 'date_from', width: 95 },
  { text: 'Last Seen', value: 'date_to', width: 95 },
  { text: 'IP', value: 'ipString', width: 110 },
  { text: 'Qty', value: 'qty', width: 50 }
]

const links = ref<LinksData[]>([])
const domain = ref('')

const loading = ref(false)
const serverItemsLength = ref(0)
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 25
  //  sortBy: 'age',
  //  sortType: 'desc',
})

const errorMessage = ref('')

const submitForm = async () => {
  serverOptions.value.page = 1
  loadFromServer()
}

const loadFromServer = async () => {
  loading.value = true
  await LinksService.getLinksList(
    domain.value,
    serverOptions.value.page,
    serverOptions.value.rowsPerPage
  ).then((data) => {
    if ('error' in data) {
      errorMessage.value = data.error
      return
    } else {
      for (let i = 0; i < data.length; i++) {
        data[i].ipString = data[i].ip.join(', ')
      }
      links.value = data
      errorMessage.value = ''
    }
  })
  if (links.value.length < serverOptions.value.rowsPerPage) {
    serverItemsLength.value =
      serverOptions.value.rowsPerPage * (serverOptions.value.page - 1) +
      links.value.length
  } else {
    serverItemsLength.value =
      serverOptions.value.rowsPerPage * serverOptions.value.page + 1
  }

  loading.value = false
}

watch(
  serverOptions,
  () => {
    loadFromServer()
  },
  { deep: true }
)

const updateCurrentPage = (newPage: number) => {
  serverOptions.value.page = newPage
}

const updateRowsPerPage = (newRowsPerPage: number) => {
  serverOptions.value.rowsPerPage = newRowsPerPage
}
</script>

<template>
  <div>
    <header class="header">
      <h1>Backlink search</h1>
    </header>
    <section class="description">
      <p>
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
    </section>
    <section class="search">
      <h2>Search for backlinks</h2>
      <form
        @submit.prevent="submitForm"
        class="search-form"
      >
        <input
          v-model="domain"
          type="text"
          placeholder="Enter domain name"
          class="domain-input"
        />
        <button
          type="submit"
          class="search-button"
        >
          Search
        </button>
      </form>

      <div
        class="error-message"
        v-if="errorMessage != ''"
      >
        {{ errorMessage }}
      </div>

      <EasyDataTable
        theme-color="#1d90ff"
        table-class-name="customize-table"
        header-text-direction="center"
        :loading="loading"
        :headers="headers"
        :items="links"
        v-model:server-options="serverOptions"
        :server-items-length="serverItemsLength"
        @update:current-page="updateCurrentPage"
        @update:rows-per-page="updateRowsPerPage"
        alternating
      >
        <template #pagination="{ isLastPage }">
          <button
            :disabled="serverOptions.page <= 1"
            @click="serverOptions.page--"
          >
            prev page
          </button>
          <button
            :disabled="isLastPage"
            @click="serverOptions.page++"
          >
            next page
          </button>
        </template>
      </EasyDataTable>
    </section>
  </div>
</template>

<style scoped>
.error-message {
  color: red;
  padding-top: 10px;
  padding-bottom: 10px;
  min-height: 60px;
}

.search-form {
  display: flex;
  justify-content: center; /* Center the form horizontally */
  gap: 10px;
  margin-bottom: 20px;
}

.domain-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1;
  max-width: 300px; /* Maximum width for input field */
  font-size: 16px;
}

.search-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}
</style>