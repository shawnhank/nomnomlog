import { useState, useEffect } from 'react';
import { Combobox, ComboboxOption, ComboboxLabel } from '../catalyst/combobox';
import { Button } from '../catalyst/button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import * as tagService from '../../services/tag';

export default function TagSelector({ selectedTags = [], onTagsChange }) {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selected, setSelected] = useState([]);

  // Load all tags on component mount
  useEffect(() => {
    async function loadTags() {
      try {
        const allTags = await tagService.getAll();
        setTags(allTags);
      } catch (err) {
        console.error('Failed to load tags:', err);
      }
    }
    
    loadTags();
  }, []);

  // Update selected tags when prop changes
  useEffect(() => {
    if (selectedTags.length) {
      // Convert tag IDs to tag objects if needed
      const selectedTagObjects = selectedTags.map(tagId => {
        if (typeof tagId === 'string') {
          const foundTag = tags.find(t => t._id === tagId);
          return foundTag || null;
        }
        return tagId;
      }).filter(Boolean);
      
      setSelected(selectedTagObjects);
    } else {
      setSelected([]);
    }
  }, [selectedTags, tags]);

  // Handle tag selection from combobox
  const handleTagSelect = (tag) => {
    if (!tag) return;
    
    // Check if tag is already selected
    if (!selected.some(t => t._id === tag._id)) {
      const updatedTags = [...selected, tag];
      setSelected(updatedTags);
      onTagsChange(updatedTags.map(t => t._id));
    }
    
    setInputValue('');
  };

  // Handle removing a tag
  const handleRemoveTag = (tagId) => {
    const updatedTags = selected.filter(tag => tag._id !== tagId);
    setSelected(updatedTags);
    onTagsChange(updatedTags.map(t => t._id));
  };

  // Handle creating a new tag
  const handleAddTag = async () => {
    if (!inputValue.trim()) return;
    
    // Check if tag already exists
    const existingTag = tags.find(
      tag => tag.name.toLowerCase() === inputValue.trim().toLowerCase()
    );
    
    if (existingTag) {
      handleTagSelect(existingTag);
      return;
    }
    
    try {
      // Create new tag
      const newTag = await tagService.create({ name: inputValue.trim() });
      
      // Add to available tags
      setTags([...tags, newTag]);
      
      // Add to selected tags
      const updatedTags = [...selected, newTag];
      setSelected(updatedTags);
      onTagsChange(updatedTags.map(t => t._id));
      
      setInputValue('');
    } catch (err) {
      console.error('Failed to create tag:', err);
    }
  };

  return (
    <div className="space-y-3">
      {/* Selected tags display */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map(tag => (
            <span 
              key={tag._id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag._id)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none dark:hover:bg-blue-800"
              >
                <XMarkIcon className="w-3 h-3" />
                <span className="sr-only">Remove tag {tag.name}</span>
              </button>
            </span>
          ))}
        </div>
      )}
      
      {/* Tag input with autocomplete */}
      <div className="flex gap-2">
        <Combobox
          as="div"
          options={tags}
          value={null}
          onChange={handleTagSelect}
          displayValue={(tag) => tag?.name || ''}
          filter={(tag, query) => 
            tag.name.toLowerCase().includes(query.toLowerCase())
          }
          placeholder="Search or add tags..."
          className="flex-1"
        >
          {(tag) => (
            <ComboboxOption value={tag}>
              <ComboboxLabel>{tag.name}</ComboboxLabel>
            </ComboboxOption>
          )}
        </Combobox>
        
        <Button
          type="button"
          onClick={handleAddTag}
          color="blue"
          outline
          className="text-sm px-2 py-1"
        >
          Add
        </Button>
      </div>
    </div>
  );
}
