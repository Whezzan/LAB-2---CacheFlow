import apiClient from '../../services/apiClient'
import type { AuctionDto } from '../../types'

export const searchAuctions = async (query = '', includeClosed = false): Promise<AuctionDto[]> => {
  const response = await apiClient.get<AuctionDto[]>('/auctions', {
    params: { query: query || undefined, includeClosed }
  })
  return response.data
}

export const getAuctionById = async (id: string | number): Promise<AuctionDto> => {
  const response = await apiClient.get<AuctionDto>(`/auctions/${id}`)
  return response.data
}

export const createAuction = async (auctionData: Partial<AuctionDto>): Promise<AuctionDto> => {
  const response = await apiClient.post<AuctionDto>('/auctions', auctionData)
  return response.data
}

export const updateAuction = async (id: string | number, auctionData: Partial<AuctionDto>): Promise<AuctionDto> => {
  const response = await apiClient.put<AuctionDto>(`/auctions/${id}`, auctionData)
  return response.data
}

export const deactivateAuction = async (id: number): Promise<void> => {
  await apiClient.patch(`/auctions/${id}/deactivate`)
}

export const activateAuction = async (id: number): Promise<void> => {
  await apiClient.patch(`/auctions/${id}/activate`)
}
