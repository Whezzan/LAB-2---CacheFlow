import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAuction } from './auctionService'
import { toLocalDatetimeValue } from './auctionUtils'
import './auctions.css'

export default function CreateAuctionPage() {
  const navigate = useNavigate()

  const now        = new Date()
  const tomorrow   = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const nextWeek   = new Date(now.getTime() + 7  * 24 * 60 * 60 * 1000)

  const [form, setForm] = useState({
    title:        '',
    description:  '',
    startingPrice: '',
    startDate:    toLocalDatetimeValue(tomorrow),
    endDate:      toLocalDatetimeValue(nextWeek),
  })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

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
      const auction = await createAuction({
        title:        form.title,
        description:  form.description,
        startingPrice: parseFloat(form.startingPrice),
        startDate:    new Date(form.startDate).toISOString(),
        endDate:      new Date(form.endDate).toISOString(),
      })
      navigate(`/auctions/${auction.id}`)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Något gick fel. Försök igen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auction-form-page page-wrapper">
      <div className="container">
        <div className="auction-form-card">
          <h1 className="auction-form-card__title">Skapa ny auktion</h1>

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
                placeholder="t.ex. Dell UltraSharp 27 tum skärm"
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
                placeholder="Beskriv produkten, skick, specifikationer..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="startingPrice">Utropspris (SEK)</label>
              <input
                id="startingPrice"
                name="startingPrice"
                type="number"
                value={form.startingPrice}
                onChange={handleChange}
                placeholder="0"
                min="1"
                step="1"
                required
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
                {loading ? 'Skapar...' : 'Skapa auktion'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
