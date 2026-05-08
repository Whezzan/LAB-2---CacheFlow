import apiClient from '../../services/apiClient'

export const getAllUsers = async () => {
  const response = await apiClient.get('/users')
  return response.data
}

export const deactivateUser = async (userId) => {
  await apiClient.patch(`/users/${userId}/deactivate`)
}

export const activateUser = async (userId) => {
  await apiClient.patch(`/users/${userId}/activate`)
}
