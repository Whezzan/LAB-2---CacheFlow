import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAuctionById } from './auctionService'
import { getBidsByAuction, undoBid } from '../bids/bidService'
import BidList from '../bids/BidList'
import PlaceBid from '../bids/PlaceBid'
import { formatCurrency, formatDate, formatTimeLeft } from './auctionUtils'
import './auctions.css'

export default function AuctionDetailPage() {
  const { id }          = useParams()
  const { user }        = useAuth()
  const navigate        = useNavigate()
  const [auction, setAuction] = useState(null)
  const [bids, setBids]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const [auctionData, bidsData] = await Promise.all([
        getAuctionById(id),
        getBidsByAuction(id)
      ])
      setAuction(auctionData)
      setBids(bidsData)
    } catch {
      setError('Auktionen kunde inte laddas.')
    } finally {
      setLoading(false)
    }
  }

  const handleBidPlaced = async () => {
    const [auctionData, bidsData] = await Promise.all([
      getAuctionById(id),
      getBidsByAuction(id)
    ])
    setAuction(auctionData)
    setBids(bidsData)
  }

  const handleUndoBid = async (bidId) => {
    try {
      await undoBid(id, bidId)
      await handleBidPlaced()
    } catch (err) {
      alert(err.response?.data?.message ?? 'Kunde inte ångra budet.')
    }
  }

  if (loading) return <div className="loading">Laddar auktion...</div>
  if (error)   return <div className="container page-wrapper"><p className="error-message">{error}</p></div>
  if (!auction) return null

  const isOwner       = user?.userId === auction.userId
  const isLoggedIn    = !!user
  const winningBid    = bids.length > 0 ? bids[0] : null
  const currentPrice  = auction.currentHighestBid > 0 ? auction.currentHighestBid : auction.startingPrice

  return (
    <div className="auction-detail page-wrapper">
      <div className="container">
        <Link to="/auctions" className="auction-detail__back">← Tillbaka till auktioner</Link>

        <div className="auction-detail__layout">
          {/* Left: main info */}
          <div className="auction-detail__main">
            <div className="auction-detail__image-area">
              <span className="auction-detail__icon">{getIcon(auction.title)}</span>
            </div>
          </div>

          {/* Right: details */}
          <div className="auction-detail__info">
            <div className="auction-detail__status">
              <span className={`badge ${auction.isOpen ? 'badge-open' : 'badge-closed'}`}>
                {auction.isOpen ? formatTimeLeft(auction.endDate) : 'Avslutad'}
              </span>
              {!auction.isActive && (
                <span className="badge badge-inactive">Inaktiverad</span>
              )}
            </div>

            <h1 className="auction-detail__title">{auction.title}</h1>
            <p className="auction-detail__seller">Av: <strong>{auction.sellerUsername}</strong></p>

            <div className="auction-detail__price-block">
              <div>
                <p className="auction-detail__price-label">
                  {auction.bidCount > 0 ? 'Högsta bud' : 'Utropspris'}
                </p>
                <p className="auction-detail__price">{formatCurrency(currentPrice)}</p>
              </div>
              <div>
                <p className="auction-detail__price-label">Antal bud</p>
                <p className="auction-detail__price">{auction.bidCount}</p>
              </div>
            </div>

            <div className="auction-detail__dates">
              <p><span>Start:</span> {formatDate(auction.startDate)}</p>
              <p><span>Slut:</span>  {formatDate(auction.endDate)}</p>
            </div>

            <div className="auction-detail__description">
              <h3>Beskrivning</h3>
              <p>{auction.description}</p>
            </div>

            {/* Edit button for owner */}
            {isOwner && auction.isOpen && (
              <Link to={`/auctions/${auction.id}/edit`} className="btn btn-secondary auction-detail__edit-btn">
                Redigera auktion
              </Link>
            )}
          </div>
        </div>

        {/* Bidding section */}
        <div className="auction-detail__bidding">
          {auction.isOpen ? (
            <>
              {/* Bid form */}
              {isLoggedIn && !isOwner && (
                <PlaceBid
                  auctionId={auction.id}
                  minimumBid={currentPrice}
                  onBidPlaced={handleBidPlaced}
                />
              )}

              {isOwner && (
                <div className="auction-detail__owner-notice">
                  Du kan inte lägga bud på din egen auktion.
                </div>
              )}

              {!isLoggedIn && (
                <div className="auction-detail__login-notice">
                  <Link to="/login" className="auction-detail__login-link">Logga in</Link> för att lägga ett bud.
                </div>
              )}

              {/* Bid history */}
              <BidList bids={bids} currentUserId={user?.userId} onUndoBid={handleUndoBid} />
            </>
          ) : (
            /* Closed auction: show only winning bid */
            <div className="auction-detail__closed">
              <h2>Auktionen är avslutad</h2>
              {winningBid ? (
                <div className="auction-detail__winning-bid">
                  <p className="auction-detail__price-label">Vinnande bud</p>
                  <p className="auction-detail__price">{formatCurrency(winningBid.amount)}</p>
                  <p className="auction-detail__winner">Av: <strong>{winningBid.bidderUsername}</strong></p>
                </div>
              ) : (
                <p className="auction-detail__no-bids">Inga bud lades på denna auktion.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getIcon(title) {
  const lower = title.toLowerCase()
  if (lower.includes('skärm') || lower.includes('monitor'))  return '🖥️'
  if (lower.includes('laptop') || lower.includes('dator'))   return '💻'
  if (lower.includes('keyboard') || lower.includes('tangentbord')) return '⌨️'
  if (lower.includes('mus') || lower.includes('mouse'))      return '🖱️'
  if (lower.includes('moderkort'))                           return '🔧'
  if (lower.includes('ram') || lower.includes('minne'))      return '💾'
  if (lower.includes('grafik') || lower.includes('gpu'))     return '💿'
  return '🖥️'
}
