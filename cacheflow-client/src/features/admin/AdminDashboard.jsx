import { useState, useEffect } from 'react'
import { getAllUsers, activateUser, deactivateUser } from './adminService'
import { searchAuctions, activateAuction, deactivateAuction } from '../auctions/auctionService'
import { formatDate, formatCurrency } from '../auctions/auctionUtils'
import './admin.css'

export default function AdminDashboard() {
  const [activeTab, setActiveTab]     = useState('auctions')
  const [auctions, setAuctions]       = useState([])
  const [users, setUsers]             = useState([])
  const [loadingAuctions, setLoadingAuctions] = useState(false)
  const [loadingUsers, setLoadingUsers]       = useState(false)
  const [feedback, setFeedback]       = useState('')

  useEffect(() => {
    if (activeTab === 'auctions') loadAllAuctions()
    if (activeTab === 'users')    loadAllUsers()
  }, [activeTab])

  const loadAllAuctions = async () => {
    setLoadingAuctions(true)
    try {
      const [open, closed] = await Promise.all([
        searchAuctions('', false),
        searchAuctions('', true)
      ])
      setAuctions([...open, ...closed])
    } finally {
      setLoadingAuctions(false)
    }
  }

  const loadAllUsers = async () => {
    setLoadingUsers(true)
    try {
      const data = await getAllUsers()
      setUsers(data)
    } finally {
      setLoadingUsers(false)
    }
  }

  const showFeedback = (msg) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(''), 3000)
  }

  const handleToggleAuction = async (auction) => {
    try {
      if (auction.isActive) {
        await deactivateAuction(auction.id)
        showFeedback(`"${auction.title}" inaktiverades.`)
      } else {
        await activateAuction(auction.id)
        showFeedback(`"${auction.title}" aktiverades.`)
      }
      loadAllAuctions()
    } catch {
      showFeedback('Något gick fel.')
    }
  }

  const handleToggleUser = async (user) => {
    try {
      if (user.isActive) {
        await deactivateUser(user.id)
        showFeedback(`Kontot för "${user.username}" inaktiverades.`)
      } else {
        await activateUser(user.id)
        showFeedback(`Kontot för "${user.username}" aktiverades.`)
      }
      loadAllUsers()
    } catch {
      showFeedback('Något gick fel.')
    }
  }

  return (
    <div className="admin-page page-wrapper">
      <div className="container">
        <h1 className="admin-page__title">Admin Dashboard</h1>

        {feedback && <p className="success-message admin-page__feedback">{feedback}</p>}

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'auctions' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('auctions')}
          >
            Auktioner
          </button>
          <button
            className={`admin-tab ${activeTab === 'users' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Användare
          </button>
        </div>

        {/* Auctions tab */}
        {activeTab === 'auctions' && (
          <div className="admin-panel">
            <h2 className="admin-panel__title">Alla auktioner ({auctions.length})</h2>
            {loadingAuctions ? (
              <div className="loading">Laddar auktioner...</div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Titel</th>
                      <th>Säljare</th>
                      <th>Utropspris</th>
                      <th>Slutdatum</th>
                      <th>Status</th>
                      <th>Åtgärd</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auctions.map((auction) => (
                      <tr key={auction.id}>
                        <td>
                          <a href={`/auctions/${auction.id}`} className="admin-table__link">
                            {auction.title}
                          </a>
                        </td>
                        <td>{auction.sellerUsername}</td>
                        <td>{formatCurrency(auction.startingPrice)}</td>
                        <td className="admin-table__date">{formatDate(auction.endDate)}</td>
                        <td>
                          <span className={`badge ${auction.isActive ? (auction.isOpen ? 'badge-open' : 'badge-closed') : 'badge-inactive'}`}>
                            {!auction.isActive ? 'Inaktiv' : auction.isOpen ? 'Öppen' : 'Avslutad'}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`btn ${auction.isActive ? 'btn-danger' : 'btn-success'} admin-table__action-btn`}
                            onClick={() => handleToggleAuction(auction)}
                          >
                            {auction.isActive ? 'Inaktivera' : 'Aktivera'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="admin-panel">
            <h2 className="admin-panel__title">Alla användare ({users.length})</h2>
            {loadingUsers ? (
              <div className="loading">Laddar användare...</div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Användarnamn</th>
                      <th>E-post</th>
                      <th>Roll</th>
                      <th>Registrerad</th>
                      <th>Status</th>
                      <th>Åtgärd</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td><strong>{user.username}</strong></td>
                        <td>{user.email}</td>
                        <td>
                          {user.isAdmin
                            ? <span className="badge admin-table__admin-badge">Admin</span>
                            : <span>Användare</span>}
                        </td>
                        <td className="admin-table__date">{formatDate(user.createdAt)}</td>
                        <td>
                          <span className={`badge ${user.isActive ? 'badge-open' : 'badge-inactive'}`}>
                            {user.isActive ? 'Aktiv' : 'Inaktiv'}
                          </span>
                        </td>
                        <td>
                          {!user.isAdmin && (
                            <button
                              className={`btn ${user.isActive ? 'btn-danger' : 'btn-success'} admin-table__action-btn`}
                              onClick={() => handleToggleUser(user)}
                            >
                              {user.isActive ? 'Inaktivera' : 'Aktivera'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
