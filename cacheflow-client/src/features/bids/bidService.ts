import apiClient from '../../services/apiClient'
import type { BidDto } from '../../types'

export const getBidsByAuction = async (auctionId: string | number): Promise<BidDto[]> => {
  const response = await apiClient.get<BidDto[]>(`/auctions/${auctionId}/bids`)
  return response.data
}

export const placeBid = async (auctionId: string | number, amount: number): Promise<BidDto> => {
  const response = await apiClient.post<BidDto>(`/auctions/${auctionId}/bids`, { amount })
  return response.data
}

export const undoBid = async (auctionId: string | number, bidId: number): Promise<void> => {
  await apiClient.delete(`/auctions/${auctionId}/bids/${bidId}`)
}
