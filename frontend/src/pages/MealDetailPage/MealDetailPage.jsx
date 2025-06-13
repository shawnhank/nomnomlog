import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { PlusIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from '@heroicons/react/24/solid';
import * as mealService from '../../services/meal';
import * as mealTagService from '../../services/mealTag';
import { Button } from '../../components/catalyst/button';
import { Textarea } from '../../components/catalyst/textarea';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import SimpleBreadcrumbs from '../../components/SimpleBreadcrumbs/SimpleBreadcrumbs';
import ReactMarkdown from 'react-markdown';

export default function MealDetailPage() {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mealTags, setMealTags] = useState([]);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const notesTextareaRef = useRef(null);
  const saveTimeoutRef = useRef(null);
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
        setNotes(mealData.notes || '');
        
        // Fetch tags for this meal
        const mealTagsData = await mealTagService.getAllForMeal(id);
        setMealTags(mealTagsData);
      } catch (err) {
        setError('Failed to load meal details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMeal();
  }, [id]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditingNotes && notesTextareaRef.current) {
      notesTextareaRef.current.focus();
    }
  }, [isEditingNotes]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
  async function handleThumbsRating(newValue) {
    try {
      const updatedMeal = await mealService.setThumbsRating(id, newValue);
      setMeal(updatedMeal);
    } catch (err) {
      setError('Failed to update thumbs rating');
    }
  }



  // Handle notes change with debounced auto-save
  function handleNotesChange(e) {
    const newNotes = e.target.value;
    setNotes(newNotes);
    
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set a new timeout to save after 1 second of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      saveNotes(newNotes);
    }, 1000);
  }

  // Save notes
  async function saveNotes(notesToSave = notes) {
    // Don't save if notes haven't changed
    if (meal.notes === notesToSave) {
      return;
    }

    try {
      setSavingNotes(true);
      const updatedMeal = await mealService.update(id, { ...meal, notes: notesToSave });
      setMeal(updatedMeal);
    } catch (err) {
      setError('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  }

  // Start editing notes
  function startEditingNotes() {
    setIsEditingNotes(true);
  }

  // Stop editing notes and save if needed
  function stopEditingNotes() {
    // Clear any pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    
    // Save if there are changes
    if (meal.notes !== notes) {
      saveNotes();
    }
    
    setIsEditingNotes(false);
  }

  // Handle edit navigation
  function handleEdit() {
    navigate(`/meals/${id}/edit`);
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading meal details...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!meal) return <div className="text-gray-600 p-4">Meal not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <SimpleBreadcrumbs
          customCrumbs={[
            { name: 'Meals', path: '/meals', current: false },
            { name: meal.name, path: `/meals/${meal._id}`, current: true }
          ]}
        />
      </div>

      {/* Header with meal name and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">{meal.name}</h1>
        <div className="flex space-x-2 items-center">
          <Link to="/meals/new">
            <Button positive className="flex items-center">
              <PlusIcon className="w-5 h-5 mr-1" />
              <span>Add Meal</span>
            </Button>
          </Link>
          <Link to={`/meals/${meal._id}/edit`}>
            <Button positive>Edit</Button>
          </Link>
          <Button
            negative
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Meal details with hero image styling */}
      {meal.mealImages && meal.mealImages.length > 0 && (
        <div className="relative overflow-hidden rounded-lg mb-6">
          <img
            src={meal.mealImages.find(img => img.isPrimary)?.url || meal.mealImages[0]?.url || meal.imageUrl}
            alt={meal.name}
            className="w-full h-80 object-cover"
          />

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-70% to-black/80"></div>

          {/* Text overlay with meal info */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4">
            <div className="space-y-3">
              {/* Restaurant link */}
              {meal.restaurantId && (
                <div className="flex items-start">
                  <div className="flex flex-col">
                    <Link
                      to={`/restaurants/${meal.restaurantId._id}`}
                      className="text-blue-300 hover:text-blue-200 font-medium"
                    >
                      {meal.restaurantId.name}
                    </Link>
                  </div>
                </div>
              )}

              {/* Date and thumbs rating row */}
              <div className="flex justify-between items-center">
                <span className="text-white text-sm">
                  {meal.date ? new Date(meal.date).toLocaleDateString() : ''}
                </span>

                {/* Thumbs rating buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleThumbsRating(meal.isThumbsUp === true ? null : true)}
                    className="text-white hover:text-green-500"
                    title="Would order again"
                  >
                    {meal.isThumbsUp === true ? (
                      <HandThumbUpSolid className="w-5 h-5 text-green-500" />
                    ) : (
                      <HandThumbUpIcon className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleThumbsRating(meal.isThumbsUp === false ? null : false)}
                    className="text-white hover:text-red-500"
                    title="Would not order again"
                  >
                    {meal.isThumbsUp === false ? (
                      <HandThumbDownSolid className="w-5 h-5 text-red-500" />
                    ) : (
                      <HandThumbDownIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for no image */}
      {(!meal.mealImages || meal.mealImages.length === 0) && !meal.imageUrl && (
        <div className="mb-6 space-y-4">
          {/* Restaurant */}
          {meal.restaurantId && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1">Restaurant</h3>
              <Link
                to={`/restaurants/${meal.restaurantId._id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {meal.restaurantId.name}
              </Link>
            </div>
          )}

          {/* Date */}
          {meal.date && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1">Date</h3>
              <p className="text-gray-700">{new Date(meal.date).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      )}

      {/* Tags section */}
      {mealTags && mealTags.length > 0 && (
        <div className="border-t pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">Tags</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {mealTags.map(mealTag => (
              <div
                key={mealTag._id}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800"
              >
                <span>{mealTag.tagId.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes section */}
      <div className="border-t pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-semibold mb-2 sm:mb-0">Notes</h2>
          {savingNotes && (
            <span className="text-sm text-gray-500 italic">Saving...</span>
          )}
        </div>

        {isEditingNotes ? (
          <div>
            <Textarea
              ref={notesTextareaRef}
              value={notes}
              onChange={handleNotesChange}
              onBlur={stopEditingNotes}
              rows={4}
              placeholder="Add notes about this meal... (Markdown supported)"
              className="w-full mb-2"
            />
            <div className="text-xs text-gray-500 mb-2">
              Supports Markdown: **bold**, *italic*, # heading, - list, [link](url)
            </div>
          </div>
        ) : (
          <div
            onClick={startEditingNotes}
            className="prose prose-sm max-w-none p-3 rounded-md border border-transparent hover:border-gray-300 cursor-text min-h-[3rem]"
          >
            {notes ? (
              <ReactMarkdown
                components={{
                  a: ({node, ...props}) => (
                    <a
                      {...props}
                      className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  )
                }}
              >
                {notes}
              </ReactMarkdown>
            ) : (
              <span className="text-gray-400 italic">Click to add notes (Markdown supported)</span>
            )}
          </div>
        )}
      </div>

      {/* Image gallery section */}
      {meal.mealImages && meal.mealImages.length > 1 && (
        <div className="border-t pt-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">Photos</h2>
            <Button
              onClick={handleEdit}
              positive
            >
              Manage Photos
            </Button>
          </div>

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
        </div>
      )}

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
