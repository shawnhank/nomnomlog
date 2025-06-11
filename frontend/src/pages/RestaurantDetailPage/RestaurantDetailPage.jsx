import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import * as restaurantService from '../../services/restaurant';
import * as restaurantTagService from '../../services/restaurantTag';
import './RestaurantDetailPage.css';

export default function RestaurantDetailPage() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tags, setTags] = useState([]);
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch restaurant details when component mounts or id changes
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log(`Fetching restaurant with ID: ${id}`);
        
        const restaurantData = await restaurantService.getById(id);
        console.log('Restaurant data received:', restaurantData);
        
        if (!restaurantData || Object.keys(restaurantData).length === 0) {
          console.error('Empty restaurant data received');
          setError('Failed to load restaurant data');
        } else {
          setRestaurant(restaurantData);
          
          try {
            // Fetch tags for this restaurant
            const tagsData = await restaurantTagService.getAllForRestaurant(id);
            setTags(tagsData);
          } catch (tagErr) {
            console.error('Error fetching tags:', tagErr);
            // Don't fail the whole page if just tags fail
          }
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(`Failed to load restaurant: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
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
        <h2>{restaurant.name}</h2>
        <div className="action-buttons">
          <Link to={`/restaurants/${id}/edit`} className="action-button">Edit</Link>
          <button 
            className="action-button delete" 
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Restaurant details */}
      <div className="restaurant-details">
        {tags.length > 0 && (
          <div className="detail-item">
            <span className="label">Tags:</span>
            <div className="tags-container">
              {tags.map(tag => (
                <span key={tag._id} className="tag-badge">{tag.name}</span>
              ))}
            </div>
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
