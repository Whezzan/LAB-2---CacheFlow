import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import apiClient from '../../services/apiClient'
import './profile.css'

export default function ProfilePage() {
  const { user } = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError]                     = useState('')
  const [success, setSuccess]                 = useState('')
  const [loading, setLoading]                 = useState(false)

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword.length < 8) {
      setError('Nytt lösenord måste vara minst 8 tecken.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Lösenorden matchar inte.')
      return
    }

    setLoading(true)
    try {
      await apiClient.put('/users/me/password', { currentPassword, newPassword })
      setSuccess('Lösenordet har uppdaterats.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Något gick fel. Försök igen.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="profile-page page-wrapper">
      <div className="container">
        <div className="profile-layout">
          {/* User info card */}
          <div className="profile-card">
            <div className="profile-card__avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h2 className="profile-card__username">{user.username}</h2>
            {user.isAdmin && (
              <span className="badge profile-card__admin-badge">Admin</span>
            )}
          </div>

          {/* Password change form */}
          <div className="profile-form-card">
            <h2 className="profile-form-card__title">Ändra lösenord</h2>
            <p className="profile-form-card__note">
              Användarnamn kan inte ändras.
            </p>

            <form className="profile-form" onSubmit={handlePasswordChange} noValidate>
              {error   && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <div className="form-group">
                <label htmlFor="currentPassword">Nuvarande lösenord</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Nytt lösenord</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minst 8 tecken"
                  minLength={8}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Bekräfta nytt lösenord</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="btn btn-primary profile-form__submit" disabled={loading}>
                {loading ? 'Sparar...' : 'Uppdatera lösenord'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
