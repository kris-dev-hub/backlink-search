import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomePage from '../components/HomePage.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/dev/backlink-search', component: HomePage },
  { path: '/', component: HomePage }
]

const index = createRouter({
  history: createWebHistory(),
  routes
})
export default index
