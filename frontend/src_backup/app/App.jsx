import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '../widgets/dashboard/DashboardLayout'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ProductCatalogPage from '../pages/catalog/ProductCatalogPage'
import ProductDetailPage from '../pages/catalog/ProductDetailPage'
import MyProductsPage from '../pages/seller/MyProductsPage'
import UserProfilePage from '../pages/profile/UserProfilePage'
import { getAuthToken } from '../shared/lib/auth'

function ProtectedRoute({ children }) {
  const token = getAuthToken()

  if (!token) {
    return <Navigate to="/" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        )}
      >
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<ProductCatalogPage />} />
        <Route path="products/:productId" element={<ProductDetailPage />} />
        <Route path="my-products" element={<MyProductsPage />} />
        <Route path="profile" element={<UserProfilePage />} />
      </Route>
    </Routes>
  )
}
