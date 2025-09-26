import { createApp } from 'vue'
import './assets/tailwind.css'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Paginator from 'primevue/paginator'
import ProgressSpinner from 'primevue/progressspinner'

const app = createApp(App)

app.use(router)
app.use(PrimeVue)

app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('InputText', InputText)
app.component('Button', Button)
app.component('Dropdown', Dropdown)
app.component('Paginator', Paginator)
app.component('ProgressSpinner', ProgressSpinner)

app.mount('#app')
