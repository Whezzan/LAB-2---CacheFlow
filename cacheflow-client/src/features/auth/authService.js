import apiClient from '../../services/apiClient'

export const register = async (username, email, password) => {
  const response = await apiClient.post('/auth/register', { username, email, password })
  return response.data
}

export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data
}
