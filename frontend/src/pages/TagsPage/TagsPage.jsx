import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/catalyst/button';
import { Input } from '../../components/catalyst/input';
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import * as tagService from '../../services/tag';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import SimpleBreadcrumbs from '../../components/SimpleBreadcrumbs/SimpleBreadcrumbs';

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTagId, setEditingTagId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // 'single' or 'bulk'
  const [singleDeleteTag, setSingleDeleteTag] = useState(null);
  const [newTagName, setNewTagName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  // Load tags when component mounts
  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    try {
      setLoading(true);
      const tagsData = await tagService.getAll();
      setTags(tagsData);
      setError('');
    } catch (err) {
      setError('Failed to load tags');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Handle individual tag selection
  function handleTagSelect(tagId, checked) {
    const newSelected = new Set(selectedTags);
    if (checked) {
      newSelected.add(tagId);
    } else {
      newSelected.delete(tagId);
    }
    setSelectedTags(newSelected);
  }



  // Start editing a tag
  function startEditing(tag) {
    setEditingTagId(tag._id);
    setEditingName(tag.name);
  }

  // Cancel editing
  function cancelEditing() {
    setEditingTagId(null);
    setEditingName('');
  }

  // Save tag edit
  async function saveEdit() {
    if (!editingName.trim()) return;
    
    try {
      const updatedTag = await tagService.update(editingTagId, { name: editingName.trim() });
      setTags(tags.map(tag => tag._id === editingTagId ? updatedTag : tag));
      setEditingTagId(null);
      setEditingName('');
    } catch (err) {
      setError('Failed to update tag');
      console.error(err);
    }
  }

  // Handle single tag delete
  function handleSingleDelete(tag) {
    setSingleDeleteTag(tag);
    setDeleteTarget('single');
    setShowDeleteModal(true);
  }

  // Handle bulk delete
  function handleBulkDelete() {
    if (selectedTags.size === 0) return;
    setDeleteTarget('bulk');
    setShowDeleteModal(true);
  }

  // Confirm delete
  async function confirmDelete() {
    try {
      if (deleteTarget === 'single' && singleDeleteTag) {
        await tagService.deleteTag(singleDeleteTag._id);
        setTags(tags.filter(tag => tag._id !== singleDeleteTag._id));
        setSelectedTags(prev => {
          const newSet = new Set(prev);
          newSet.delete(singleDeleteTag._id);
          return newSet;
        });
      } else if (deleteTarget === 'bulk') {
        // Delete all selected tags
        const deletePromises = Array.from(selectedTags).map(tagId => 
          tagService.deleteTag(tagId)
        );
        await Promise.all(deletePromises);
        
        // Update state
        setTags(tags.filter(tag => !selectedTags.has(tag._id)));
        setSelectedTags(new Set());
      }
      
      setShowDeleteModal(false);
      setSingleDeleteTag(null);
      setDeleteTarget(null);
    } catch (err) {
      setError('Failed to delete tag(s)');
      console.error(err);
    }
  }

  // Add new tag
  async function addNewTag() {
    if (!newTagName.trim()) return;

    try {
      const newTag = await tagService.create({ name: newTagName.trim() });
      setTags([...tags, newTag]);
      setNewTagName('');
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to create tag');
      console.error(err);
    }
  }

  // Add new tag from search
  async function addTagFromSearch() {
    if (!searchTerm.trim()) return;

    try {
      const newTag = await tagService.create({ name: searchTerm.trim() });
      setTags([...tags, newTag]);
      setSearchTerm('');
    } catch (err) {
      setError('Failed to create tag');
      console.error(err);
    }
  }

  // Filter tags based on search term
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading tags...</div>
      </div>
    );
  }

  const selectedCount = selectedTags.size;
  const hasSearchResults = searchTerm && filteredTags.length === 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6" style={{ width: '100%', minWidth: '320px' }}>
      {/* Breadcrumbs */}
      <div className="mb-4">
        <SimpleBreadcrumbs
          customCrumbs={[
            { name: 'Tags', path: '/tags', current: true }
          ]}
        />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Tags</h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAddForm(true)}
            positive
            className="flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            <span>Add Tag</span>
          </Button>

          {selectedCount > 1 && (
            <Button
              onClick={() => {
                setSelectedTags(new Set());
              }}
              negative
              className="flex items-center gap-2"
              title="Clear selection"
            >
              <XMarkIcon className="w-4 h-4" />
              <span className="text-sm">Clear</span>
            </Button>
          )}

          {selectedCount > 0 && (
            <Button
              onClick={handleBulkDelete}
              negative
              className="flex items-center justify-center"
              title={`Delete ${selectedCount} tag${selectedCount > 1 ? 's' : ''}`}
            >
              <TrashIcon className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {/* Create tag from search */}
        {hasSearchResults && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              No tags found for "{searchTerm}"
            </p>
            <Button
              onClick={addTagFromSearch}
              positive
              size="sm"
              className="flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              <span>Create "{searchTerm}" tag</span>
            </Button>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add new tag form */}
      {showAddForm && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-3">Add New Tag</h3>
          <div className="flex gap-3">
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
            />
            <Button onClick={addNewTag} positive>
              Add
            </Button>
            <Button onClick={() => {
              setShowAddForm(false);
              setNewTagName('');
            }}>
              Cancel
            </Button>
          </div>
        </div>
      )}



      {/* Tags pills */}
      {filteredTags.length === 0 ? (
        <div className="text-center py-12">
          {searchTerm ? (
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No tags found for "{searchTerm}"
              </p>
              <Button
                onClick={addTagFromSearch}
                positive
                className="flex items-center mx-auto"
              >
                <PlusIcon className="w-5 h-5 mr-1" />
                <span>Create "{searchTerm}" tag</span>
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">No tags found</p>
              <Button
                onClick={() => setShowAddForm(true)}
                positive
                className="flex items-center mx-auto"
              >
                <PlusIcon className="w-5 h-5 mr-1" />
                <span>Create Your First Tag</span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {filteredTags.map((tag) => (
            <div key={tag._id} className="relative">
              {editingTagId === tag._id ? (
                <div className="inline-flex items-center justify-center bg-white dark:bg-gray-800 border-2 border-blue-300 rounded-full px-4 py-2 min-w-[80px]">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm text-center min-w-0 w-full"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEditing();
                    }}
                    onBlur={saveEdit}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ) : (
                <div className="relative group">
                  <div
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 hover:shadow-sm min-w-[80px] ${
                      selectedTags.has(tag._id)
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-600'
                        : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => handleTagSelect(tag._id, !selectedTags.has(tag._id))}
                  >
                    {/* Tag name - centered and clickable for editing */}
                    <span
                      className="select-none text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(tag);
                      }}
                    >
                      {tag.name}
                    </span>
                  </div>

                  {/* Delete X - floating on upper right corner */}
                  {!selectedTags.has(tag._id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSingleDelete(tag);
                      }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Delete tag"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSingleDeleteTag(null);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        title={deleteTarget === 'bulk' ? 'Delete Selected Tags' : 'Delete Tag'}
        message={
          deleteTarget === 'bulk'
            ? `Are you sure you want to delete ${selectedCount} selected tag(s)? This action cannot be undone.`
            : `Are you sure you want to delete this tag? This action cannot be undone.`
        }
        itemName={deleteTarget === 'single' ? singleDeleteTag?.name : ''}
      />
    </div>
  );
}
