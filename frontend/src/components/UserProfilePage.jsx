import { useEffect, useState } from 'react'
import './UserProfilePanel.css'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

function createEmptyAddress() {
  return {
    address_line: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    is_default: false,
  }
}

function getAuthHeaders() {
  const token = sessionStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options)
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(
      typeof data?.detail === 'string' ? data.detail : `Request failed (${response.status})`
    )
    error.status = response.status
    throw error
  }

  return data
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' })
  const [addressForm, setAddressForm] = useState(createEmptyAddress())

  const [loading, setLoading] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [addressSaving, setAddressSaving] = useState(false)

  const [error, setError] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [addressError, setAddressError] = useState('')
  const [addressSuccess, setAddressSuccess] = useState('')

  const loadUserData = async () => {
    setLoading(true)
    setError('')

    try {
      const authUser = await fetchJson(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      })

      const userProfile = await fetchJson(
        `${API_BASE_URL}/users/by-email?email=${encodeURIComponent(authUser.email)}`,
        {
          headers: getAuthHeaders(),
        }
      )

      const userAddresses = await fetchJson(`${API_BASE_URL}/users/${userProfile.id}/addresses`, {
        headers: getAuthHeaders(),
      })

      setProfile(userProfile)
      setProfileForm({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
      })
      setAddresses(Array.isArray(userAddresses) ? userAddresses : [])
    } catch (err) {
      if (err.status === 404) {
        setError('No user profile was found in user-service for this account yet.')
      } else {
        setError(err.message || 'Could not load your user profile')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleProfileInput = (event) => {
    const { name, value } = event.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressInput = (event) => {
    const { name, value, type, checked } = event.target
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()

    if (!profile?.id) {
      return
    }

    setProfileSaving(true)
    setProfileError('')
    setProfileSuccess('')

    try {
      const payload = {
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim() || null,
      }

      const updatedProfile = await fetchJson(`${API_BASE_URL}/users/${profile.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })

      setProfile(updatedProfile)
      setProfileForm({
        name: updatedProfile.name || '',
        phone: updatedProfile.phone || '',
      })
      setProfileSuccess('Profile updated successfully.')
    } catch (err) {
      setProfileError(err.message || 'Could not update your profile')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleAddressSubmit = async (event) => {
    event.preventDefault()

    if (!profile?.id) {
      return
    }

    setAddressSaving(true)
    setAddressError('')
    setAddressSuccess('')

    try {
      await fetchJson(`${API_BASE_URL}/users/${profile.id}/addresses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(addressForm),
      })

      const userAddresses = await fetchJson(`${API_BASE_URL}/users/${profile.id}/addresses`, {
        headers: getAuthHeaders(),
      })

      setAddresses(Array.isArray(userAddresses) ? userAddresses : [])
      setAddressForm(createEmptyAddress())
      setAddressSuccess('Address added successfully.')
    } catch (err) {
      setAddressError(err.message || 'Could not save the address')
    } finally {
      setAddressSaving(false)
    }
  }

  return (
    <section className="user-panel-section" aria-label="User profile">
      <div className="user-panel-header">
        <div>
          <h2>My profile</h2>
          <p className="user-panel-subtitle">
            View and edit your personal data in a dedicated profile section.
          </p>
        </div>
        <button
          className="user-refresh-button"
          type="button"
          onClick={loadUserData}
          disabled={loading || profileSaving || addressSaving}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading && <p className="user-panel-state">Loading user profile...</p>}
      {!loading && error && <p className="user-panel-error">{error}</p>}

      {!loading && !error && profile && (
        <div className="user-panel-grid">
          <article className="user-profile-card identity-card">
            <div className="identity-top">
              <div className="avatar-pill">{(profile.name || profile.email).slice(0, 1).toUpperCase()}</div>
              <div>
                <h3>{profile.name}</h3>
                <p>{profile.email}</p>
              </div>
            </div>

            <div className="user-profile-item">
              <span className="item-label">Role</span>
              <span className="user-role-chip">{profile.role || 'customer'}</span>
            </div>

            <div className="user-profile-item">
              <span className="item-label">Phone</span>
              <span className="item-value">{profile.phone || 'Not configured yet'}</span>
            </div>
          </article>

          <article className="user-profile-card edit-card">
            <h3>Edit profile</h3>

            {profileError && <p className="user-panel-error">{profileError}</p>}
            {profileSuccess && <p className="user-panel-success">{profileSuccess}</p>}

            <form className="profile-form" onSubmit={handleProfileSubmit}>
              <label>
                Full name
                <input
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileInput}
                  minLength={2}
                  maxLength={120}
                  required
                />
              </label>

              <label>
                Phone
                <input
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileInput}
                  placeholder="Optional"
                  maxLength={40}
                />
              </label>

              <button type="submit" disabled={profileSaving}>
                {profileSaving ? 'Saving profile...' : 'Save profile'}
              </button>
            </form>
          </article>

          <div className="user-address-grid">
            <article className="user-address-card">
              <h3>Saved addresses</h3>

              {addresses.length === 0 ? (
                <p className="user-panel-state">You do not have saved addresses yet.</p>
              ) : (
                <ul className="address-list">
                  {addresses.map((address) => (
                    <li key={address.id} className="address-item">
                      <p>{address.address_line}</p>
                      <p>
                        {address.city}, {address.state}, {address.country}
                      </p>
                      <p>Postal code: {address.postal_code}</p>
                      {address.is_default && <span className="default-pill">Default</span>}
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="user-address-card">
              <h3>Add address</h3>

              {addressError && <p className="user-panel-error">{addressError}</p>}
              {addressSuccess && <p className="user-panel-success">{addressSuccess}</p>}

              <form className="address-form" onSubmit={handleAddressSubmit}>
                <input
                  name="address_line"
                  placeholder="Address line"
                  value={addressForm.address_line}
                  onChange={handleAddressInput}
                  required
                />
                <input
                  name="city"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={handleAddressInput}
                  required
                />
                <input
                  name="state"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={handleAddressInput}
                  required
                />
                <input
                  name="country"
                  placeholder="Country"
                  value={addressForm.country}
                  onChange={handleAddressInput}
                  required
                />
                <input
                  name="postal_code"
                  placeholder="Postal code"
                  value={addressForm.postal_code}
                  onChange={handleAddressInput}
                  required
                  minLength={3}
                  maxLength={20}
                />

                <label className="checkbox-line">
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={addressForm.is_default}
                    onChange={handleAddressInput}
                  />
                  Set as default address
                </label>

                <button type="submit" disabled={addressSaving}>
                  {addressSaving ? 'Saving address...' : 'Save address'}
                </button>
              </form>
            </article>
          </div>
        </div>
      )}
    </section>
  )
}