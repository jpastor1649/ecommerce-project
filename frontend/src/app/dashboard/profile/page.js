import { cookies } from 'next/headers'
import UserProfilePage from '../../../pages/profile/UserProfilePage'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://api-gateway:8000').replace(/\/$/, '')

async function getInitialData(token) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
  try {
    const authUser = await fetch(`${API_BASE_URL}/auth/me`, { headers, cache: 'no-store' }).then(r => r.ok ? r.json() : null)
    if (!authUser) return {}

    const userProfile = await fetch(`${API_BASE_URL}/users/by-email?email=${encodeURIComponent(authUser.email)}`, { headers, cache: 'no-store' }).then(r => r.ok ? r.json() : null)
    if (!userProfile) return { authUser }

    const addresses = await fetch(`${API_BASE_URL}/users/${userProfile.id}/addresses`, { headers, cache: 'no-store' }).then(r => r.ok ? r.json() : [])

    return { authUser, userProfile, addresses }
  } catch { return {} }
}

export default async function ProfilePage() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')?.value
  const initialData = token ? await getInitialData(token) : {}
  return <UserProfilePage initialData={initialData} />
}
