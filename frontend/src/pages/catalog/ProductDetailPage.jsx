'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function ProductDetailPage({ productId, initialData = {} }) {
  const router = useRouter()
  const hasInitialSSRData = Boolean(initialData?.hydrated)

  const [product, setProduct] = useState(initialData.product || null)
  const [categoryName, setCategoryName] = useState(initialData.categoryName || 'Unknown category')
  const [sellerName, setSellerName] = useState(initialData.sellerName || 'Unknown seller')
  const [images, setImages] = useState(Array.isArray(initialData.images) ? initialData.images : [])
  const [reviews, setReviews] = useState(Array.isArray(initialData.reviews) ? initialData.reviews : [])
  const [reviewerLabels, setReviewerLabels] = useState(initialData.reviewerLabels || {})
  const [loading, setLoading] = useState(!hasInitialSSRData)
  const [error, setError] = useState(initialData.error || '')
  const [loadWarning, setLoadWarning] = useState(initialData.loadWarning || '')
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
    if (!productId) {
      setError('Invalid product identifier.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    setLoadWarning('')
    try {
      const warningMessages = []

      const [
        productResult,
        reviewsResult,
        categoriesResult,
        imagesResult,
      ] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/products/${productId}`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/products/${productId}/reviews`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/products/categories`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/products/${productId}/images`, { headers: getAuthHeaders() }),
      ])

      if (productResult.status !== 'fulfilled') {
        throw new Error('Could not load product details')
      }

      const productResponse = productResult.value
      const reviewsResponse = reviewsResult.status === 'fulfilled' ? reviewsResult.value : null
      const categoriesResponse = categoriesResult.status === 'fulfilled' ? categoriesResult.value : null
      const imagesResponse = imagesResult.status === 'fulfilled' ? imagesResult.value : null

      const productData = await productResponse.json().catch(() => ({}))
      const reviewsData = reviewsResponse ? await reviewsResponse.json().catch(() => ([])) : []
      const categoriesData = categoriesResponse ? await categoriesResponse.json().catch(() => ([])) : []
      const imagesData = imagesResponse ? await imagesResponse.json().catch(() => ([])) : []

      if (!productResponse.ok) {
        throw new Error(
          typeof productData?.detail === 'string' ? productData.detail : 'Could not load product details'
        )
      }
      if (!reviewsResponse || !reviewsResponse.ok) {
        warningMessages.push('Reviews are temporarily unavailable.')
      }

      if (!categoriesResponse || !categoriesResponse.ok) {
        warningMessages.push('Category labels are temporarily unavailable.')
      }

      if (!imagesResponse || !imagesResponse.ok) {
        warningMessages.push('Product gallery is temporarily unavailable.')
      }

      const sellerResponse = await fetch(`${API_BASE_URL}/users/${productData.seller_user_id}`, {
        headers: getAuthHeaders(),
      })
      const sellerData = await sellerResponse.json().catch(() => ({}))

      if (sellerResponse.ok) {
        setSellerName(sellerData?.name || sellerData?.email || 'Unknown seller')
      } else {
        const authSellerResponse = await fetch(`${API_BASE_URL}/auth/users/${productData.seller_user_id}`, {
          headers: getAuthHeaders(),
        })
        const authSellerData = await authSellerResponse.json().catch(() => ({}))
        if (authSellerResponse.ok) {
          setSellerName(authSellerData?.email || 'Unknown seller')
        } else {
          setSellerName('Unknown seller')
        }
      }

      setProduct(productData)
      setReviews(Array.isArray(reviewsData) ? reviewsData : [])
      setImages(Array.isArray(imagesData) ? imagesData : [])

      const safeReviews = Array.isArray(reviewsData) ? reviewsData : []
      const reviewerIds = [...new Set(safeReviews.map((review) => review.reviewer_user_id).filter(Boolean))]
      if (reviewerIds.length) {
        const labelResults = await Promise.allSettled(reviewerIds.map(async (reviewerId) => {
          const userResponse = await fetch(`${API_BASE_URL}/users/${reviewerId}`, {
            headers: getAuthHeaders(),
          })
          const userData = await userResponse.json().catch(() => ({}))
          if (userResponse.ok) {
            return [reviewerId, userData?.name || userData?.email || String(reviewerId)]
          }

          const authResponse = await fetch(`${API_BASE_URL}/auth/users/${reviewerId}`, {
            headers: getAuthHeaders(),
          })
          const authData = await authResponse.json().catch(() => ({}))
          if (authResponse.ok) {
            return [reviewerId, authData?.email || String(reviewerId)]
          }

          return [reviewerId, String(reviewerId)]
        }))

        const labelEntries = labelResults
          .filter((entry) => entry.status === 'fulfilled')
          .map((entry) => entry.value)

        if (labelResults.some((entry) => entry.status === 'rejected')) {
          warningMessages.push('Some reviewer labels could not be loaded.')
        }

        setReviewerLabels(Object.fromEntries(labelEntries))
      } else {
        setReviewerLabels({})
      }

      const matchedCategory = Array.isArray(categoriesData)
        ? categoriesData.find((category) => category.id === productData.category_id)
        : null
      setCategoryName(matchedCategory?.name || 'Unknown category')

      if (warningMessages.length) {
        setLoadWarning(warningMessages.join(' '))
      }

    } catch (err) {
      setError(err.message || 'Could not load product details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasInitialSSRData) {
      return
    }

    void loadProductDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, hasInitialSSRData])

  useEffect(() => {
    if (!hasInitialSSRData) {
      return
    }

    setProduct(initialData.product || null)
    setCategoryName(initialData.categoryName || 'Unknown category')
    setSellerName(initialData.sellerName || 'Unknown seller')
    setImages(Array.isArray(initialData.images) ? initialData.images : [])
    setReviews(Array.isArray(initialData.reviews) ? initialData.reviews : [])
    setReviewerLabels(initialData.reviewerLabels || {})
    setLoadWarning(initialData.loadWarning || '')
    setError(initialData.error || '')
    setLoading(false)
  }, [hasInitialSSRData, initialData, productId])

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
        <button type="button" className="detail-back" onClick={() => router.push('/dashboard/products')}>
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
      <button type="button" className="detail-back" onClick={() => router.push('/dashboard/products')}>
        Back to catalog
      </button>

      {loadWarning && <p className="detail-warning">{loadWarning}</p>}

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
                <p className="detail-muted">By: {reviewerLabels[review.reviewer_user_id] || review.reviewer_user_id}</p>
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
