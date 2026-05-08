import { Link } from 'react-router-dom'
import { formatTimeLeft, formatCurrency } from './auctionUtils'
import type { AuctionDto } from '../../types'
import './auctions.css'

interface AuctionCardProps {
  auction: AuctionDto
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const currentPrice = auction.currentHighestBid > 0
    ? auction.currentHighestBid
    : auction.startingPrice

  return (
    <Link to={`/auctions/${auction.id}`} className="auction-card">
      <div className="auction-card__image-area">
        <div className="auction-card__placeholder">
          <span className="auction-card__category-icon">{getCategoryIcon(auction.title)}</span>
        </div>
        <span className="auction-card__price-badge">
          {formatCurrency(currentPrice)}
        </span>
      </div>

      <div className="auction-card__body">
        <h3 className="auction-card__title">{auction.title}</h3>
        <p className="auction-card__seller">Säljare: {auction.sellerUsername}</p>

        <div className="auction-card__meta">
          <span className="auction-card__bids">
            {auction.bidCount} {auction.bidCount === 1 ? 'bud' : 'bud'}
          </span>
          <span className={`badge ${auction.isOpen ? 'badge-open' : 'badge-closed'}`}>
            {auction.isOpen ? formatTimeLeft(auction.endDate) : 'Avslutad'}
          </span>
        </div>
      </div>
    </Link>
  )
}

function getCategoryIcon(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes('skärm') || lower.includes('monitor') || lower.includes('display')) return '🖥️'
  if (lower.includes('laptop') || lower.includes('dator'))                                return '💻'
  if (lower.includes('keyboard') || lower.includes('tangentbord'))                       return '⌨️'
  if (lower.includes('mus') || lower.includes('mouse'))                                  return '🖱️'
  if (lower.includes('moderkort') || lower.includes('motherboard'))                      return '🔧'
  if (lower.includes('ram') || lower.includes('minne'))                                  return '💾'
  if (lower.includes('grafik') || lower.includes('gpu'))                                 return '💿'
  if (lower.includes('mobil') || lower.includes('phone'))                                return '📱'
  return '🖥️'
}
