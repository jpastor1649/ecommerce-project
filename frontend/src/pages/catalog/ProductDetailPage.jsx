import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_BASE_URL } from '../../shared/config/api'
import { getAuthHeaders } from '../../shared/lib/auth'
import './ProductDetailPage.css'

function formatPrice(price) {
  const value = Number(price)
  if (Number.isNaN(value)) return String(price)
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

function Stars({ rating }) {
  return <span>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
}

export default function ProductDetailPage() {
  const navigate = useNavigate()
  const { productId } = useParams()

  const [product, setProduct] = useState(null)
  const [categoryName, setCategoryName] = useState('Unknown category')
  const [sellerName, setSellerName] = useState('Unknown seller')
  const [images, setImages] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reviewing, setReviewing] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState('')
  const [reviewForm, setReviewForm] = useState({ rating: '5', comment: '' })

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0
    const total = reviews.reduce((acc, item) => acc + Number(item.rating || 0), 0)
    return total / reviews.length
  }, [reviews])

  const loadProductDetail = async () => {
    setLoading(true)
    setError('')
    try {
      const [productResponse, reviewsResponse, categoriesResponse, imagesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/products/${productId}`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/products/${productId}/reviews`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/products/categories`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/products/${productId}/images`, { headers: getAuthHeaders() }),
      ])

      const productData = await productResponse.json().catch(() => ({}))
      const reviewsData = await reviewsResponse.json().catch(() => ([]))
      const categoriesData = await categoriesResponse.json().catch(() => ([]))
      const imagesData = await imagesResponse.json().catch(() => ([]))

      if (!productResponse.ok) {
        throw new Error(
          typeof productData?.detail === 'string' ? productData.detail : 'Could not load product details'
        )
      }
      if (!reviewsResponse.ok) {
        throw new Error('Could not load product reviews')
      }

      if (!categoriesResponse.ok) {
        throw new Error('Could not load categories')
      }

      if (!imagesResponse.ok) {
        throw new Error('Could not load product gallery')
      }

      const sellerResponse = await fetch(`${API_BASE_URL}/users/${productData.seller_user_id}`, {
        headers: getAuthHeaders(),
      })
      const sellerData = await sellerResponse.json().catch(() => ({}))

      setProduct(productData)
      setReviews(Array.isArray(reviewsData) ? reviewsData : [])
      setImages(Array.isArray(imagesData) ? imagesData : [])

      const matchedCategory = Array.isArray(categoriesData)
        ? categoriesData.find((category) => category.id === productData.category_id)
        : null
      setCategoryName(matchedCategory?.name || 'Unknown category')

      if (sellerResponse.ok) {
        setSellerName(sellerData?.name || sellerData?.email || 'Unknown seller')
      } else {
        setSellerName('Unknown seller')
      }
    } catch (err) {
      setError(err.message || 'Could not load product details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProductDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  const handleReviewInput = (event) => {
    const { name, value } = event.target
    setReviewForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitReview = async (event) => {
    event.preventDefault()
    setReviewError('')
    setReviewSuccess('')
    setReviewing(true)

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment.trim() || null,
        }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof data?.detail === 'string' ? data.detail : 'Could not submit review')
      }

      setReviewSuccess('Review saved successfully.')
      setReviewForm((prev) => ({ ...prev, comment: '' }))
      await loadProductDetail()
    } catch (err) {
      setReviewError(err.message || 'Could not submit review')
    } finally {
      setReviewing(false)
    }
  }

  if (loading) {
    return (
      <section className="product-detail-section">
        <p className="detail-state">Loading product detail...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="product-detail-section">
        <button type="button" className="detail-back" onClick={() => navigate('/dashboard/products')}>
          Back to catalog
        </button>
        <p className="detail-error">{error}</p>
      </section>
    )
  }

  if (!product) {
    return null
  }

  return (
    <section className="product-detail-section">
      <button type="button" className="detail-back" onClick={() => navigate('/dashboard/products')}>
        Back to catalog
      </button>

      <article className="detail-card">
        <div className="detail-main">
          <p className="detail-kicker">Product detail</p>
          <h2>{product.name}</h2>
          <p className="detail-description">{product.description || 'No detailed description provided.'}</p>

          <div className="detail-specs">
            <p><strong>Price:</strong> {formatPrice(product.price)}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Category:</strong> {categoryName}</p>
            <p><strong>Seller:</strong> {sellerName}</p>
            <p><strong>Slug:</strong> {product.slug}</p>
          </div>
        </div>

        <aside className="detail-summary">
          <h3>Rating summary</h3>
          <p className="detail-average">{averageRating.toFixed(1)} / 5</p>
          <p>{reviews.length} review(s)</p>
        </aside>
      </article>

      <article className="detail-card">
        <h3>Image gallery</h3>
        {images.length === 0 ? (
          <p className="detail-state">This product does not have images yet.</p>
        ) : (
          <div className="detail-gallery-grid">
            {images.map((image) => (
              <figure key={image.id} className="detail-gallery-item">
                <img src={image.image_url} alt={image.alt_text || product.name} loading="lazy" />
                {image.alt_text && <figcaption>{image.alt_text}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </article>

      <article className="detail-card">
        <h3>Product reviews</h3>
        {reviews.length === 0 ? (
          <p className="detail-state">This product has no reviews yet.</p>
        ) : (
          <ul className="detail-reviews-list">
            {reviews.map((review) => (
              <li className="detail-review-item" key={review.id}>
                <p><Stars rating={review.rating} /> ({review.rating}/5)</p>
                <p>{review.comment || 'No comment provided.'}</p>
                <p className="detail-muted">By: {review.reviewer_user_id}</p>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="detail-card">
        <h3>Write your review</h3>
        <p className="detail-muted">Share your opinion about this product listing.</p>

        {reviewError && <p className="detail-error">{reviewError}</p>}
        {reviewSuccess && <p className="detail-success">{reviewSuccess}</p>}

        <form className="detail-review-form" onSubmit={handleSubmitReview}>
          <label>
            Rating
            <select name="rating" value={reviewForm.rating} onChange={handleReviewInput}>
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </label>

          <label>
            Comment
            <textarea
              name="comment"
              value={reviewForm.comment}
              onChange={handleReviewInput}
              rows={4}
              maxLength={1200}
              placeholder="Tell others about your experience with this product"
            />
          </label>

          <button type="submit" disabled={reviewing}>
            {reviewing ? 'Saving review...' : 'Publish review'}
          </button>
        </form>
      </article>
    </section>
  )
}
