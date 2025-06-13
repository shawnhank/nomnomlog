import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { PlusIcon } from '@heroicons/react/24/outline';
import * as mealService from '../../services/meal';
import * as mealTagService from '../../services/mealTag';
import * as tagService from '../../services/tag';
import { Button } from '../../components/catalyst/button';
import { Textarea } from '../../components/catalyst/textarea';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import SimpleBreadcrumbs from '../../components/SimpleBreadcrumbs/SimpleBreadcrumbs';
import MealCard from '../../components/MealCard/MealCard';
import ThumbsRating from '../../components/ThumbsRating/ThumbsRating';
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
        <div className="flex flex-nowrap gap-3 shrink-0 sm:ml-4">
          <Link 
            to="/meals/new"
            className="inline-flex items-center justify-center gap-x-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap"
          >
            <PlusIcon className="w-5 h-5" aria-hidden="true" />
            <span>Add Meal</span>
          </Link>
          <Link to={`/meals/${meal._id}/edit`}>
            <button 
              className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200"
            >
              Edit
            </button>
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Meal Card - larger size */}
      <div className="mb-6 max-w-xl mx-auto">
        <MealCard meal={meal} />
      </div>

      {/* Meal details */}
      <div className="space-y-6">
        {/* Tags */}
        {mealTags && mealTags.length > 0 && (
          <div>
            <p className="section-heading">Tags</p>
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

        {/* Notes - with inline editing and markdown support */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="section-heading">Notes</p>
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

        {/* Would order again - with ThumbsRating component */}
        <div>
          <div className="flex justify-between items-center">
            <p className="section-heading">Would order again?</p>
            <ThumbsRating 
              value={meal.isThumbsUp}
              onChange={handleThumbsRating}
              size="lg"
            />
          </div>
        </div>

        {/* Image gallery (if there are multiple images) */}
        {meal.mealImages && meal.mealImages.length > 1 && (
          <div className="my-6">
            <h3 className="section-heading">Photos</h3>
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
