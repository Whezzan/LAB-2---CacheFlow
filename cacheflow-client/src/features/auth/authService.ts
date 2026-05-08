import apiClient from '../../services/apiClient'
import type { AuthUser } from '../../types'

export const register = async (username: string, email: string, password: string): Promise<AuthUser> => {
  const response = await apiClient.post<AuthUser>('/auth/register', { username, email, password })
  return response.data
}

export const login = async (email: string, password: string): Promise<AuthUser> => {
  const response = await apiClient.post<AuthUser>('/auth/login', { email, password })
  return response.data
}
