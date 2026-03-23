import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/login'
import Register from './components/Register'
import ProductCatalog from './components/ProductCatalog'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('authToken')

  if (!token) {
    return <Navigate to="/" replace />
  }

  return children
}

function Dashboard() {
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Welcome to your E-commerce</h1>
          <p>
            You have successfully logged in. Start exploring our products.
          </p>
        </div>
      </section>

      <div className="ticks"></div>

      <ProductCatalog />

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
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
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App