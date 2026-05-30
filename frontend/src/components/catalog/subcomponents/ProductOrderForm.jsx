/**
 * Product order form component
 */
import { API_BASE_URL } from '../../../shared/config/api'
import { fetchJsonWithAuth, extractErrorDetail } from '../../../shared/utils/api'
import { useFormHandler } from '../../../shared/hooks/useFormHandler'

const initialOrderForm = {
  full_name: '',
  street: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  phone: '',
  notes: '',
}

export default function ProductOrderForm({ product }) {
  const { values, loading, error, success, handleChange, handleSubmit, setValues } = useFormHandler(
    initialOrderForm,
    async (formValues) => {
      const quantity = Math.max(1, Number.parseInt(document.querySelector('input[type="number"]')?.value || 1, 10))

      const payload = {
        items: [{ product_id: product.id, quantity }],
        shipping_address: {
          full_name: formValues.full_name.trim(),
          street: formValues.street.trim(),
          city: formValues.city.trim(),
          state: formValues.state.trim(),
          country: formValues.country.trim(),
          postal_code: formValues.postal_code.trim(),
          phone: formValues.phone.trim() || null,
        },
        notes: formValues.notes.trim() || null,
      }

      const response = await fetchJsonWithAuth(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      setValues({ ...initialOrderForm })
      return {
        message: `Order #${String(response?.id || '').slice(0, 8)} was created successfully.`,
      }
    }
  )

  return (
    <form className="detail-order-form" onSubmit={handleSubmit}>
      {error && <p className="detail-error">{error}</p>}
      {success && <p className="detail-success">{success}</p>}

      <div className="detail-order-grid">
        <label>
          Quantity
          <input
            type="number"
            min="1"
            max={String(Math.max(1, product.stock || 1))}
            defaultValue="1"
            required
          />
        </label>

        <label>
          Full name
          <input
            name="full_name"
            value={values.full_name}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            required
          />
        </label>

        <label>
          Street
          <input
            name="street"
            value={values.street}
            onChange={handleChange}
            minLength={5}
            maxLength={200}
            required
          />
        </label>

        <label>
          City
          <input
            name="city"
            value={values.city}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            required
          />
        </label>

        <label>
          State
          <input
            name="state"
            value={values.state}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            required
          />
        </label>

        <label>
          Country
          <input
            name="country"
            value={values.country}
            onChange={handleChange}
            minLength={2}
            maxLength={100}
            required
          />
        </label>

        <label>
          Postal code
          <input
            name="postal_code"
            value={values.postal_code}
            onChange={handleChange}
            minLength={3}
            maxLength={20}
            required
          />
        </label>

        <label>
          Phone (optional)
          <input
            name="phone"
            value={values.phone}
            onChange={handleChange}
            maxLength={20}
          />
        </label>
      </div>

      <label>
        Notes (optional)
        <textarea
          name="notes"
          value={values.notes}
          onChange={handleChange}
          rows={3}
          maxLength={500}
          placeholder="Delivery references, preferences, or extra context"
        />
      </label>

      <button type="submit" disabled={loading || product.stock <= 0}>
        {loading ? 'Creating order...' : 'Create order'}
      </button>
    </form>
  )
}
