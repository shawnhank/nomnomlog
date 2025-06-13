import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/catalyst/button';
import { Input } from '../../components/catalyst/input';
import { Checkbox } from '../../components/catalyst/checkbox';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import * as tagService from '../../services/tag';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import SimpleBreadcrumbs from '../../components/SimpleBreadcrumbs/SimpleBreadcrumbs';
import SearchBar from '../../components/SearchBar/SearchBar';

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

  // Handle select all/none
  function handleSelectAll(checked) {
    if (checked) {
      setSelectedTags(new Set(tags.map(tag => tag._id)));
    } else {
      setSelectedTags(new Set());
    }
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
  const allSelected = filteredTags.length > 0 && selectedTags.size === filteredTags.length;
  const someSelected = selectedTags.size > 0 && selectedTags.size < filteredTags.length;
  const hasSearchResults = searchTerm && filteredTags.length === 0;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
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
        <Button
          onClick={() => setShowAddForm(true)}
          positive
          className="flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          <span>Add Tag</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search tags..."
          className="w-full"
          autoFocus={false}
        />

        {/* Create tag from search */}
        {hasSearchResults && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 mb-2">
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

      {/* Bulk actions */}
      {filteredTags.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3 mb-3 sm:mb-0">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(checked) => handleSelectAll(checked)}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCount === 0
                ? `Select tags (${filteredTags.length} ${searchTerm ? 'found' : 'total'})`
                : `${selectedCount} selected`
              }
            </span>
          </div>

          {selectedCount > 0 && (
            <Button
              onClick={handleBulkDelete}
              negative
              className="flex items-center"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              <span>Delete Selected ({selectedCount})</span>
            </Button>
          )}
        </div>
      )}

      {/* Tags grid */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTags.map((tag) => (
            <div
              key={tag._id}
              className={`group relative bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
                selectedTags.has(tag._id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
              onClick={() => handleTagSelect(tag._id, !selectedTags.has(tag._id))}
            >
              {editingTagId === tag._id ? (
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEditing();
                      }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button onClick={saveEdit} positive size="sm">
                      Save
                    </Button>
                    <Button onClick={cancelEditing} size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {/* Selection indicator */}
                  <div className="flex items-start justify-between mb-2">
                    <Checkbox
                      checked={selectedTags.has(tag._id)}
                      onChange={(checked) => handleTagSelect(tag._id, checked)}
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Action buttons - show on hover or when selected */}
                    <div className={`flex gap-1 transition-opacity ${
                      selectedTags.has(tag._id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(tag);
                        }}
                        size="sm"
                        className="p-1 hover:bg-blue-100 text-blue-600 border-blue-300"
                        outline
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSingleDelete(tag);
                        }}
                        negative
                        size="sm"
                        className="p-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tag name */}
                  <div className="text-gray-900 dark:text-white font-medium">
                    {tag.name}
                  </div>
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
