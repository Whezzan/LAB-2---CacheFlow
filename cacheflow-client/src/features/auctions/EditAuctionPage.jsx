import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAuctionById, updateAuction } from './auctionService'
import { toLocalDatetimeValue } from './auctionUtils'
import './auctions.css'

export default function EditAuctionPage() {
  const { id }    = useParams()
  const { user }  = useAuth()
  const navigate  = useNavigate()

  const [form, setForm]     = useState(null)
  const [hasBids, setHasBids] = useState(false)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const loadAuction = async () => {
      try {
        const auction = await getAuctionById(id)

        if (auction.userId !== user?.userId && !user?.isAdmin) {
          navigate(`/auctions/${id}`)
          return
        }

        setHasBids(auction.bidCount > 0)
        setForm({
          title:         auction.title,
          description:   auction.description,
          startingPrice: auction.startingPrice.toString(),
          startDate:     toLocalDatetimeValue(auction.startDate),
          endDate:       toLocalDatetimeValue(auction.endDate),
        })
      } catch {
        setError('Auktionen kunde inte laddas.')
      } finally {
        setFetching(false)
      }
    }
    loadAuction()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (new Date(form.endDate) <= new Date(form.startDate)) {
      setError('Slutdatum måste vara efter startdatum.')
      return
    }

    setLoading(true)
    try {
      await updateAuction(id, {
        title:         form.title,
        description:   form.description,
        startingPrice: hasBids ? undefined : parseFloat(form.startingPrice),
        startDate:     new Date(form.startDate).toISOString(),
        endDate:       new Date(form.endDate).toISOString(),
      })
      navigate(`/auctions/${id}`)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Något gick fel. Försök igen.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="loading">Laddar...</div>
  if (!form)    return <div className="container page-wrapper"><p className="error-message">{error}</p></div>

  return (
    <div className="auction-form-page page-wrapper">
      <div className="container">
        <div className="auction-form-card">
          <h1 className="auction-form-card__title">Redigera auktion</h1>

          <form className="auction-form" onSubmit={handleSubmit} noValidate>
            {error && <p className="error-message">{error}</p>}

            <div className="form-group">
              <label htmlFor="title">Titel</label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                minLength={3}
                maxLength={200}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Beskrivning</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="startingPrice">
                Utropspris (SEK)
                {hasBids && <span className="auction-form__hint"> – kan inte ändras (det finns bud)</span>}
              </label>
              <input
                id="startingPrice"
                name="startingPrice"
                type="number"
                value={form.startingPrice}
                onChange={handleChange}
                min="1"
                step="1"
                disabled={hasBids}
                required={!hasBids}
              />
            </div>

            <div className="auction-form__dates">
              <div className="form-group">
                <label htmlFor="startDate">Startdatum</label>
                <input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">Slutdatum</label>
                <input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auction-form__actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                Avbryt
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sparar...' : 'Spara ändringar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
