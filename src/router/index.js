import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '../views/SearchView.vue'
import LocationView from '../views/LocationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Search',
      component: SearchView
    },
    {
      path: '/location',
      name: 'Location',
      component: LocationView
    }
  ]
})

export default router
