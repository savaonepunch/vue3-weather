import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLocationsStore = defineStore(
  'locations', () => {
    const locations = ref([])

    return { locations }
  },
  {
    persist: true
  }
)