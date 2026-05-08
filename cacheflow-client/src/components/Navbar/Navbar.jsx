import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-cache">Cache</span>
          <span className="navbar__logo-flow">Flow</span>
        </Link>

        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          <NavLink to="/"        className="navbar__link" onClick={closeMenu} end>Hem</NavLink>
          <NavLink to="/auctions" className="navbar__link" onClick={closeMenu}>Auktioner</NavLink>

          {user && (
            <NavLink to="/sell" className="navbar__link" onClick={closeMenu}>Sälj</NavLink>
          )}

          {user?.isAdmin && (
            <NavLink to="/admin" className="navbar__link navbar__link--admin" onClick={closeMenu}>
              Admin
            </NavLink>
          )}

          <div className="navbar__auth">
            {user ? (
              <>
                <NavLink to="/profile" className="navbar__link" onClick={closeMenu}>
                  {user.username}
                </NavLink>
                <button className="btn btn-secondary navbar__logout" onClick={handleLogout}>
                  Logga ut
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar__link" onClick={closeMenu}>Logga in</Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Registrera</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
