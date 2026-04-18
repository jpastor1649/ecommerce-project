import { useState } from 'react'
import { Routes, Route, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import './App.css'
import Login from './components/login'
import Register from './components/Register'
import ProductCatalog from './components/ProductCatalog'
import UserProfilePage from './components/UserProfilePage'
import aicartLogo from './assets/AICart.png'
import heroImg from './assets/hero.png'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('authToken')

  if (!token) {
    return <Navigate to="/" replace />
  }

  return children
}

function DashboardLayout() {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    const token = sessionStorage.getItem('authToken')

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
      // Always continue with local logout even if API is unreachable.
    } finally {
      sessionStorage.removeItem('authToken')
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
            Products
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

      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="dashboard-hero-kicker">Customer Area</p>
          <h1>Control your shopping experience</h1>
          <p>
            Switch between product discovery and your personal profile with one click.
          </p>
        </div>
        <img src={heroImg} className="dashboard-hero-image" width="170" height="179" alt="" />
      </section>

      <section className="dashboard-content">
        <Outlet />
      </section>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<ProductCatalog />} />
        <Route path="profile" element={<UserProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App