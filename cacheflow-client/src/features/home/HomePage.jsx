import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuctionCard from '../auctions/AuctionCard'
import { searchAuctions } from '../auctions/auctionService'
import './home.css'

export default function HomePage() {
  const [searchQuery, setSearchQuery]   = useState('')
  const [auctions, setAuctions]         = useState([])
  const [hasSearched, setHasSearched]   = useState(false)
  const [loading, setLoading]           = useState(false)
  const navigate                         = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      navigate('/auctions')
      return
    }
    setLoading(true)
    try {
      const results = await searchAuctions(searchQuery.trim(), false)
      setAuctions(results)
      setHasSearched(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <div className="home__hero-content container">
          <p className="home__hero-tagline">Begagnad IT – Köp &amp; Sälj</p>
          <h1 className="home__hero-title">
            Den bästa platsen för<br />begagnad IT-utrustning
          </h1>
          <p className="home__hero-subtitle">
            Skärmar, keyboards, moderkort, datorer, laptops, RAM och mer –
            hitta fynd eller sälj din utrustning på CacheFlow.
          </p>

          <form className="home__search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Sök efter auktioner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="home__search-input"
            />
            <button type="submit" className="btn btn-primary home__search-btn">
              Sök
            </button>
          </form>

          <div className="home__hero-actions">
            <a href="/auctions" className="btn btn-primary">Bläddra auktioner</a>
            <a href="/register" className="btn btn-secondary home__btn-outline">Kom igång</a>
          </div>
        </div>
      </section>

      {/* Search results */}
      {hasSearched && (
        <section className="home__results page-wrapper">
          <div className="container">
            <h2 className="home__section-title">
              {auctions.length > 0
                ? `${auctions.length} resultat för "${searchQuery}"`
                : `Inga öppna auktioner hittades för "${searchQuery}"`}
            </h2>
            {loading ? (
              <div className="loading">Söker...</div>
            ) : (
              <div className="home__auction-grid">
                {auctions.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories section */}
      {!hasSearched && (
        <section className="home__categories page-wrapper">
          <div className="container">
            <p className="home__section-label">KATEGORIER</p>
            <h2 className="home__section-title">Populära kategorier</h2>
            <div className="home__category-grid">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.label}
                  href={`/auctions?search=${encodeURIComponent(cat.label)}`}
                  className="home__category-card"
                >
                  <span className="home__category-icon">{cat.icon}</span>
                  <span className="home__category-label">{cat.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

const CATEGORIES = [
  { icon: '🖥️', label: 'Skärmar' },
  { icon: '💻', label: 'Laptops' },
  { icon: '⌨️', label: 'Keyboards' },
  { icon: '🖱️', label: 'Möss' },
  { icon: '🔧', label: 'Moderkort' },
  { icon: '💾', label: 'RAM' },
  { icon: '💿', label: 'Grafikkort' },
  { icon: '📱', label: 'Mobiler' },
]
