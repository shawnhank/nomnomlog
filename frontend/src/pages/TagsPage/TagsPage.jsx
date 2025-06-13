import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/catalyst/button';
import { Input } from '../../components/catalyst/input';
import { Checkbox } from '../../components/catalyst/checkbox';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import * as tagService from '../../services/tag';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import SimpleBreadcrumbs from '../../components/SimpleBreadcrumbs/SimpleBreadcrumbs';

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading tags...</div>
      </div>
    );
  }

  const selectedCount = selectedTags.size;
  const allSelected = tags.length > 0 && selectedTags.size === tags.length;
  const someSelected = selectedTags.size > 0 && selectedTags.size < tags.length;

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
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Manage Tags</h1>
        <Button
          onClick={() => setShowAddForm(true)}
          positive
          className="flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          <span>Add Tag</span>
        </Button>
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
      {tags.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3 mb-3 sm:mb-0">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(checked) => handleSelectAll(checked)}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCount === 0 
                ? `Select tags (${tags.length} total)`
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

      {/* Tags list */}
      {tags.length === 0 ? (
        <div className="text-center py-12">
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
      ) : (
        <div className="space-y-2">
          {tags.map((tag) => (
            <div
              key={tag._id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  checked={selectedTags.has(tag._id)}
                  onChange={(checked) => handleTagSelect(tag._id, checked)}
                />
                
                {editingTagId === tag._id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEditing();
                      }}
                      autoFocus
                    />
                    <Button onClick={saveEdit} positive size="sm">
                      Save
                    </Button>
                    <Button onClick={cancelEditing} size="sm">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <span className="text-gray-900 dark:text-white font-medium flex-1">
                    {tag.name}
                  </span>
                )}
              </div>
              
              {editingTagId !== tag._id && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => startEditing(tag)}
                    size="sm"
                    className="flex items-center"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleSingleDelete(tag)}
                    negative
                    size="sm"
                    className="flex items-center"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
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
