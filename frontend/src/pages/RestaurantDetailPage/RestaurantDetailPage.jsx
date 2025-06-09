import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import './RestaurantDetailPage.css';

export default function RestaurantDetailPage() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch restaurant details when component mounts or id changes
  useEffect(() => {
    async function fetchRestaurant() {
      try {
        setLoading(true);
        const restaurantData = await restaurantService.getById(id);
        setRestaurant(restaurantData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load restaurant details');
        setLoading(false);
      }
    }
    
    fetchRestaurant();
  }, [id]);
  
  // Handle delete restaurant
  async function handleDelete() {
    try {
      await restaurantService.deleteRestaurant(id);
      navigate('/restaurants');
    } catch (err) {
      setError('Failed to delete restaurant');
    }
  }
  
  // Show loading state
  if (loading) {
    return <div className="RestaurantDetailPage loading">Loading restaurant details...</div>;
  }
  
  // Show error state
  if (error) {
    return <div className="RestaurantDetailPage error">{error}</div>;
  }
  
  // Show not found state
  if (!restaurant) {
    return <div className="RestaurantDetailPage not-found">Restaurant not found</div>;
  }
  
  return (
    <div className="RestaurantDetailPage">
      <div className="detail-header">
        <h1>{restaurant.name}</h1>
        <div className="action-buttons">
          <Link to={`/restaurants/${id}/edit`} className="btn-edit">Edit</Link>
          <button 
            className="btn-delete" 
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Restaurant details */}
      <div className="restaurant-details">
        {restaurant.categoryId && (
          <div className="detail-item">
            <span className="label">Category:</span>
            <span className="category-tag">{restaurant.categoryId.displayName}</span>
          </div>
        )}
        
        {restaurant.address && (
          <div className="detail-item">
            <span className="label">Address:</span>
            <span>{restaurant.address}</span>
          </div>
        )}
        
        {restaurant.phone && (
          <div className="detail-item">
            <span className="label">Phone:</span>
            <span>{restaurant.phone}</span>
          </div>
        )}
        
        {restaurant.website && (
          <div className="detail-item">
            <span className="label">Website:</span>
            <a href={restaurant.website} target="_blank" rel="noopener noreferrer">
              {restaurant.website}
            </a>
          </div>
        )}
        
        <div className="detail-item">
          <span className="label">Added:</span>
          <span>{new Date(restaurant.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{restaurant.name}</strong>?</p>
            <p>This action cannot be undone.</p>
            <div className="modal-buttons">
              <button 
                className="btn-cancel" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm-delete" 
                onClick={handleDelete}
              >
                Delete Restaurant
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Back to list link */}
      <Link to="/restaurants" className="back-link">
        &larr; Back to Restaurants
      </Link>
    </div>
  );
}