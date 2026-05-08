import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchAuctions } from './auctionService'
import AuctionCard from './AuctionCard'
import type { AuctionDto } from '../../types'
import './auctions.css'

export default function AuctionListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [auctions, setAuctions]         = useState<AuctionDto[]>([])
  const [loading, setLoading]           = useState(true)
  const [query, setQuery]               = useState(searchParams.get('search') ?? '')
  const [includeClosed, setIncludeClosed] = useState(false)

  useEffect(() => {
    loadAuctions()
  }, [includeClosed])

  const loadAuctions = async () => {
    setLoading(true)
    try {
      const results = await searchAuctions(query, includeClosed)
      setAuctions(results)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchParams(query ? { search: query } : {})
    loadAuctions()
  }

  const handleFilterChange = (closed: boolean) => {
    setIncludeClosed(closed)
  }

  return (
    <div className="auction-list-page page-wrapper">
      <div className="container">
        <div className="auction-list-page__header">
          <h1 className="auction-list-page__title">Auktioner</h1>

          <form className="auction-list-page__search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Sök på titel..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="auction-list-page__search-input"
            />
            <button type="submit" className="btn btn-primary">Sök</button>
          </form>

          <div className="auction-list-page__filters">
            <button
              className={`filter-btn ${!includeClosed ? 'filter-btn--active' : ''}`}
              onClick={() => handleFilterChange(false)}
            >
              Öppna auktioner
            </button>
            <button
              className={`filter-btn ${includeClosed ? 'filter-btn--active' : ''}`}
              onClick={() => handleFilterChange(true)}
            >
              Avslutade auktioner
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Laddar auktioner...</div>
        ) : auctions.length === 0 ? (
          <div className="auction-list-page__empty">
            <p>Inga auktioner hittades.</p>
          </div>
        ) : (
          <div className="auction-grid">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
