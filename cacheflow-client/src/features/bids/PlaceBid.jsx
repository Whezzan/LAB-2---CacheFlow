import { useState } from 'react'
import { placeBid } from './bidService'
import { formatCurrency } from '../auctions/auctionUtils'
import './bids.css'

export default function PlaceBid({ auctionId, minimumBid, onBidPlaced }) {
  const [amount, setAmount] = useState('')
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const bidAmount = parseFloat(amount)
    if (bidAmount <= minimumBid) {
      setError(`Budet måste vara högre än ${formatCurrency(minimumBid)}.`)
      return
    }

    setLoading(true)
    try {
      await placeBid(auctionId, bidAmount)
      setSuccess(`Ditt bud på ${formatCurrency(bidAmount)} är registrerat!`)
      setAmount('')
      onBidPlaced()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Budet kunde inte läggas. Försök igen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="place-bid">
      <h2 className="place-bid__title">Lägg ett bud</h2>
      <p className="place-bid__minimum">
        Minsta bud: <strong>{formatCurrency(minimumBid + 1)}</strong>
      </p>

      <form className="place-bid__form" onSubmit={handleSubmit} noValidate>
        {error   && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="place-bid__input-row">
          <div className="form-group place-bid__input-group">
            <label htmlFor="bidAmount">Ditt bud (SEK)</label>
            <input
              id="bidAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Minst ${Math.floor(minimumBid + 1)}`}
              min={minimumBid + 0.01}
              step="1"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary place-bid__submit" disabled={loading}>
            {loading ? 'Lägger bud...' : 'Lägg bud'}
          </button>
        </div>
      </form>
    </div>
  )
}
