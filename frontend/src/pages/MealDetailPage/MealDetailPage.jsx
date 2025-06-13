import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { HandThumbUpIcon, HandThumbDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import * as mealService from '../../services/meal';
import { Button } from '../../components/catalyst/button';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';

export default function MealDetailPage() {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch meal details when component mounts
  useEffect(() => {
    async function fetchMeal() {
      try {
        setLoading(true);
        const mealData = await mealService.getById(id);
        
        // Convert legacy imageUrl to mealImages if needed
        if (mealData.imageUrl && (!mealData.mealImages || mealData.mealImages.length === 0)) {
          mealData.mealImages = [{
            url: mealData.imageUrl,
            isPrimary: true,
            caption: ''
          }];
        }
        
        setMeal(mealData);
      } catch (err) {
        setError('Failed to load meal details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMeal();
  }, [id]);

  // Handle delete meal
  async function handleDelete() {
    try {
      await mealService.deleteMeal(id);
      navigate('/meals');
    } catch (err) {
      setError('Failed to delete meal');
    }
    setShowDeleteModal(false);
  }



  // Handle thumbs rating with toggle functionality
  async function handleThumbsRating(isThumbsUp) {
    try {
      const updatedMeal = await mealService.setThumbsRating(id, isThumbsUp);
      setMeal(updatedMeal);
    } catch (err) {
      setError('Failed to update thumbs rating');
    }
  }

  // Add this function to handle edit navigation
  function handleEdit() {
    navigate(`/meals/${id}/edit`);
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading meal details...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!meal) return <div className="text-gray-600 p-4">Meal not found</div>;

  // Find primary image if available
  const primaryImage = meal.mealImages && meal.mealImages.length > 0 
    ? (meal.mealImages.find(img => img.isPrimary) || meal.mealImages[0])
    : null;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      {/* Header with meal name and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">{meal.name}</h1>
        <div className="flex gap-3">
          <Link 
            to="/meals/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            <span>Add Meal</span>
          </Link>
          <Button 
            href={`/meals/${meal._id}/edit`}
            color="blue"
          >
            Edit
          </Button>
          <Button
            onClick={() => setShowDeleteModal(true)}
            color="red"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Meal details */}
      <div className="space-y-6">
        {/* Restaurant and date info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meal.restaurantId && (
            <div>
              <p className="text-gray-600 font-medium mb-1">Restaurant</p>
              <Link 
                to={`/restaurants/${meal.restaurantId._id}`}
                className="text-blue-600 hover:underline"
              >
                {meal.restaurantId.name}
              </Link>
            </div>
          )}
          <div>
            <p className="text-gray-600 font-medium mb-1">Date</p>
            <p>{new Date(meal.date).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Meal actions (thumbs only) */}
        <div className="flex gap-3 my-4">
          {/* Thumbs up button */}
          <Button 
            onClick={() => handleThumbsRating(true)}
            color={meal.isThumbsUp === true ? 'green' : 'zinc'}
            aria-label="Would Order Again"
            icon={meal.isThumbsUp === true ? HandThumbUpSolid : HandThumbUpIcon}
          />
          
          {/* Thumbs down button */}
          <Button 
            onClick={() => handleThumbsRating(false)}
            color={meal.isThumbsUp === false ? 'red' : 'zinc'}
            aria-label="Would Not Order Again"
            icon={meal.isThumbsUp === false ? HandThumbDownSolid : HandThumbDownIcon}
          />
        </div>

        {/* Primary image display */}
        {primaryImage && (
          <div className="my-6">
            <img 
              src={primaryImage.url} 
              alt={meal.name} 
              className="w-full max-h-96 object-cover rounded-lg shadow-md"
            />
            {primaryImage.caption && (
              <p className="text-sm text-gray-600 mt-1">
                {primaryImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Notes */}
        {meal.notes && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Notes</h3>
            <p className="text-gray-700 whitespace-pre-line">{meal.notes}</p>
          </div>
        )}

        {/* Image gallery (if there are multiple images) */}
        {meal.mealImages && meal.mealImages.length > 1 && (
          <div className="my-6">
            <h3 className="text-lg font-medium mb-2">Photos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {meal.mealImages.map((image, index) => (
                <div key={index} className="aspect-square">
                  <img 
                    src={image.url} 
                    alt={image.caption || `${meal.name} photo ${index + 1}`} 
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Button
                onClick={handleEdit}
                color="blue"
              >
                Manage Photos
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Meal"
        message="Are you sure you want to delete this meal? This action cannot be undone."
        itemName={meal?.name}
      />
    </div>
  );
}
