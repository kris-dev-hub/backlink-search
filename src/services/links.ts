import { APILinks } from '../utils/api.ts'
import { LinksData } from '../types/links.ts'
import axios from 'axios'

const LinksService = {
  async getLinksList(domain: string, page: number, limit: number) {
    try {
      const response = await APILinks.post<LinksData[]>('/api/links', {
        domain: domain,
        page: page,
        limit: limit
      })
      return response.data as LinksData[]
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 429) {
          return {
            error:
              'You have reached the rate limit. Please try again in 10 minutes.'
          }
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
