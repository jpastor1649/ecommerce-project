import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../shared/config/api'
import { clearAuthToken, getAuthToken } from '../../shared/lib/auth'
import aicartLogo from '../../assets/AICart.png'
import heroImg from '../../assets/hero.png'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    const token = getAuthToken()

    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch {
      // Continue local logout even if API is unavailable.
    } finally {
      clearAuthToken()
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="dashboard-shell">
      <section className="dashboard-topbar">
        <div className="dashboard-brand">
          <img src={aicartLogo} alt="AICart logo" className="dashboard-brand-logo" />
          <span className="dashboard-brand-name">AICart</span>
        </div>

        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          <NavLink
            to="products"
            className={({ isActive }) => `dashboard-nav-link${isActive ? ' active' : ''}`}
          >
            Catalog
          </NavLink>
          <NavLink
            to="my-products"
            className={({ isActive }) => `dashboard-nav-link${isActive ? ' active' : ''}`}
          >
            My products
          </NavLink>
          <NavLink
            to="profile"
            className={({ isActive }) => `dashboard-nav-link${isActive ? ' active' : ''}`}
          >
            My profile
          </NavLink>
        </nav>

        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Closing session...' : 'Logout'}
        </button>
      </section>

      <section className="dashboard-hero" aria-labelledby="dashboard-hero-title">
        <div className="dashboard-hero-copy">
          <p className="dashboard-hero-kicker">Customer Area</p>
          <h1 id="dashboard-hero-title">Your marketplace command center</h1>
          <p className="dashboard-hero-lead">
            Explore products, manage your listings, and keep your profile updated from one
            polished dashboard.
          </p>
          <div className="dashboard-hero-badges" aria-label="Key dashboard benefits">
            <span className="dashboard-hero-badge">Fast checkout</span>
            <span className="dashboard-hero-badge">Smart listings</span>
            <span className="dashboard-hero-badge">Real-time stock</span>
          </div>
        </div>

        <aside className="dashboard-hero-aside" aria-label="Dashboard highlights">
          <div className="dashboard-hero-metric">
            <p className="dashboard-hero-metric-value">24/7</p>
            <p className="dashboard-hero-metric-label">access to your store tools</p>
          </div>
          <img src={heroImg} className="dashboard-hero-image" width="170" height="179" alt="" />
        </aside>
      </section>

      <section className="dashboard-content">
        <Outlet />
      </section>
    </div>
  )
}
