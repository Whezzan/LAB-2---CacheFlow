export interface AuthUser {
  token: string
  userId: number
  username: string
  isAdmin: boolean
}

export interface AuctionDto {
  id: number
  title: string
  description: string
  startingPrice: number
  currentHighestBid: number
  startDate: string
  endDate: string
  isOpen: boolean
  isActive: boolean
  userId: number
  sellerUsername: string
  bidCount: number
}

export interface BidDto {
  id: number
  amount: number
  createdAt: string
  userId: number
  auctionId: number
  bidderUsername: string
}

export interface UserDto {
  id: number
  username: string
  email: string
  isAdmin: boolean
  isActive: boolean
  createdAt: string
}
