import apiClient from '../../services/apiClient'

export const getBidsByAuction = async (auctionId) => {
  const response = await apiClient.get(`/auctions/${auctionId}/bids`)
  return response.data
}

export const placeBid = async (auctionId, amount) => {
  const response = await apiClient.post(`/auctions/${auctionId}/bids`, { amount })
  return response.data
}

export const undoBid = async (auctionId, bidId) => {
  await apiClient.delete(`/auctions/${auctionId}/bids/${bidId}`)
}
