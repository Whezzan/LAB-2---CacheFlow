import apiClient from '../../services/apiClient'

export const searchAuctions = async (query = '', includeClosed = false) => {
  const response = await apiClient.get('/auctions', {
    params: { query: query || undefined, includeClosed }
  })
  return response.data
}

export const getAuctionById = async (id) => {
  const response = await apiClient.get(`/auctions/${id}`)
  return response.data
}

export const createAuction = async (auctionData) => {
  const response = await apiClient.post('/auctions', auctionData)
  return response.data
}

export const updateAuction = async (id, auctionData) => {
  const response = await apiClient.put(`/auctions/${id}`, auctionData)
  return response.data
}

export const deactivateAuction = async (id) => {
  await apiClient.patch(`/auctions/${id}/deactivate`)
}

export const activateAuction = async (id) => {
  await apiClient.patch(`/auctions/${id}/activate`)
}
