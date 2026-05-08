import apiClient from '../../services/apiClient'
import type { UserDto } from '../../types'

export const getAllUsers = async (): Promise<UserDto[]> => {
  const response = await apiClient.get<UserDto[]>('/users')
  return response.data
}

export const deactivateUser = async (userId: number): Promise<void> => {
  await apiClient.patch(`/users/${userId}/deactivate`)
}

export const activateUser = async (userId: number): Promise<void> => {
  await apiClient.patch(`/users/${userId}/activate`)
}
