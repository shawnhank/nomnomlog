import { useState, useEffect } from 'react';
import { Button } from '../catalyst/button';
import { Combobox, ComboboxOption, ComboboxLabel } from '../catalyst/combobox';
import * as tagService from '../../services/tag';

export default function TagSelector({ selectedTags = [], onTagsChange }) {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  
  // Load all tags when component mounts
  useEffect(() => {
    async function loadTags() {
      try {
        const tagsData = await tagService.getAll();
        setTags(tagsData);
      } catch (err) {
        console.error('Error loading tags:', err);
      }
    }
    
    loadTags();
  }, []);
  
  // Handle selecting a tag from the dropdown
  function handleTagSelect(tag) {
    if (tag && !selectedTags.includes(tag._id)) {
      onTagsChange([...selectedTags, tag._id]);
    }
  }
  
  // Handle adding a new tag
  async function handleAddNewTag() {
    if (!newTagName.trim()) return;
    
    try {
      // Create the new tag
      const newTag = await tagService.create({ name: newTagName.trim() });
      
      // Add the new tag to the list of all tags
      setTags([...tags, newTag]);
      
      // Select the new tag
      onTagsChange([...selectedTags, newTag._id]);
      
      // Clear the input
      setNewTagName('');
    } catch (err) {
      console.error('Error creating new tag:', err);
    }
  }
  
  // Handle removing a tag
  function handleRemoveTag(tagId) {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  }
  
  return (
    <div className="space-y-4">
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tagId => {
          const tag = tags.find(t => t._id === tagId);
          return tag ? (
            <div 
              key={tag._id}
              className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800"
            >
              <span>{tag.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag._id)}
                className="ml-1.5 text-blue-600 hover:text-blue-800"
              >
                &times;
              </button>
            </div>
          ) : null;
        })}
      </div>
      
      {/* Tag input with autocomplete */}
      <div className="flex gap-2 w-full">
        <div className="flex-grow">
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
            className="w-full"
          >
            {(tag) => (
              <ComboboxOption value={tag}>
                <ComboboxLabel>{tag.name}</ComboboxLabel>
              </ComboboxOption>
            )}
          </Combobox>
        </div>
        
        <Button
          type="button"
          onClick={() => {
            const input = document.querySelector('input[placeholder="Search or add tags..."]');
            const value = input?.value;
            if (value) {
              const matchingTag = tags.find(t => t.name.toLowerCase() === value.toLowerCase());
              if (matchingTag) {
                handleTagSelect(matchingTag);
              } else {
                setNewTagName(value);
                setTimeout(() => handleAddNewTag(), 0);
              }
              if (input) input.value = '';
            }
          }}
          positive
          className="text-sm px-2 py-1 whitespace-nowrap"
        >
          Add
        </Button>
      </div>
    </div>
  );
}
