import axios from 'axios'

const APILinks = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

console.log(import.meta.env.VITE_APP_API_BASE_URL)

export { APILinks }
