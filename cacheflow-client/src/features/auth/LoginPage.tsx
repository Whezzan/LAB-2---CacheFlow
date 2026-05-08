import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as loginRequest } from './authService'
import './auth.css'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginRequest(email, password)
      login(data)
      navigate('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Något gick fel. Försök igen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1 className="auth-card__title">Logga in</h1>
          <p className="auth-card__subtitle">Välkommen tillbaka till CacheFlow</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label htmlFor="email">E-postadress</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.se"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Lösenord</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary auth-form__submit" disabled={loading}>
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>

        <p className="auth-card__footer">
          Inget konto?{' '}
          <Link to="/register" className="auth-card__link">Registrera dig här</Link>
        </p>
      </div>
    </div>
  )
}
