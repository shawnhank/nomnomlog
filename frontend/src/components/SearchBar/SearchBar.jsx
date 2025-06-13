import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search...',
  className = '',
  showClearButton = true,
  autoFocus = false,
  onClear,
  disabled = false,
  ...props
}) {
  const handleClear = () => {
    onChange('');
    if (onClear) {
      onClear();
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>

      {/* Input Field - matching meal/restaurant list pages */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded"
        {...props}
      />

      {/* Clear Button */}
      {showClearButton && value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Clear search"
        >
          <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
}
