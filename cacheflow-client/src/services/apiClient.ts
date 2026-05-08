import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5050/api',
})

apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem('cacheflow_user')
  if (stored) {
    const { token } = JSON.parse(stored) as { token: string }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
