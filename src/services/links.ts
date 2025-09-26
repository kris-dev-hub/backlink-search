import { APILinks, ConvertKeysToCamelCase } from '../utils/api.ts'
import { FilterData, LinksData } from '../types/links.ts'
import axios from 'axios'
import { SortType } from 'vue3-easy-data-table'

const LinksService = {
  async getLinksList(domain: string, page: number, limit: number, sort: string, order: SortType, filters: FilterData[]) {
    try {
      const response = await APILinks.post<LinksData[]>('/api/links', {
        domain: domain,
        page: page,
        limit: limit,
        sort: sort,
        order: order,
        filters: filters
      })
      return response.data.map((item) => ConvertKeysToCamelCase(item)) as LinksData[]
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 429) {
          return {
            error:
              'You have reached the rate limit. Please try again in 10 minutes.'
          }
        }
        // Extract error message from API response
        if (error.response && error.response.data && error.response.data.error) {
          return { error: error.response.data.error }
        }
      }
      return { error: 'An error occurred while fetching data.' }
      //      return {} as LinksData[]
      //      console.log('error: ' + error)
      //      throw error
    }
  }
}

export { LinksService }
