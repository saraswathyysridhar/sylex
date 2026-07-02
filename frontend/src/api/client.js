import axios from 'axios'

// Relative '/api/...' calls only work behind the Vite dev proxy (see vite.config.js).
// In a production build there is no proxy, so we need an absolute backend URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

export default api
