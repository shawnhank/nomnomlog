import { useState, useEffect, useRef } from 'react';
import { Textarea } from '../catalyst/textarea';
import ReactMarkdown from 'react-markdown';

/**
 * A reusable component for editing and displaying markdown notes with auto-save functionality
 * 
 * @param {Object} props
 * @param {string} props.value - The markdown content
 * @param {function} props.onChange - Callback when content changes (receives new value)
 * @param {function} props.onSave - Callback to save content (receives new value)
 * @param {string} props.placeholder - Placeholder text when empty
 * @param {boolean} props.autoSave - Whether to enable auto-save (default: true)
 * @param {number} props.autoSaveDelay - Delay in ms before auto-saving (default: 1000)
 * @param {boolean} props.isSaving - Whether content is currently being saved
 * @param {string} props.className - Additional class names for the container
 */
export default function MarkdownNotes({
  value = '',
  onChange,
  onSave,
  placeholder = 'Click to add notes (Markdown supported)',
  autoSave = true,
  autoSaveDelay = 1000,
  isSaving = false,
  className = '',
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(value);
  const textareaRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Update internal state when value prop changes
  useEffect(() => {
    setContent(value);
  }, [value]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Handle content change with debounced auto-save
  function handleChange(e) {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (onChange) {
      onChange(newContent);
    }
    
    if (autoSave) {
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set a new timeout to save after delay
      saveTimeoutRef.current = setTimeout(() => {
        if (onSave) {
          onSave(newContent);
        }
      }, autoSaveDelay);
    }
  }

  // Start editing
  function startEditing() {
    setIsEditing(true);
  }

  // Stop editing and save if needed
  function stopEditing() {
    // Clear any pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    
    // Save if there are changes and onSave is provided
    if (onSave && content !== value) {
      onSave(content);
    }
    
    setIsEditing(false);
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</p>
        {isSaving && (
          <span className="text-sm text-gray-500 italic">Saving...</span>
        )}
      </div>
      
      {isEditing ? (
        <div>
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onBlur={stopEditing}
            rows={4}
            placeholder={placeholder}
            className="w-full mb-2"
          />
          <div className="text-xs text-gray-500 mb-2">
            Supports Markdown: **bold**, *italic*, # heading, - list, [link](url)
          </div>
        </div>
      ) : (
        <div 
          onClick={startEditing}
          className="prose prose-sm max-w-none p-3 rounded-md border border-transparent hover:border-gray-300 cursor-text min-h-[3rem]"
        >
          {content ? (
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
              {content}
            </ReactMarkdown>
          ) : (
            <span className="text-gray-400 italic">{placeholder}</span>
          )}
        </div>
      )}
    </div>
  );
}