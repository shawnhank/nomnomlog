// Initialize theme based on user preference or system setting
export function initializeTheme() {
  // Check if user has previously set a theme preference
  const savedTheme = localStorage.getItem('theme');
  
  // If user has explicitly chosen dark mode OR
  // user hasn't set a preference AND system prefers dark mode
  if (
    savedTheme === 'dark' || 
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Toggle between light and dark themes
export function toggleTheme() {
  // Check current theme
  const isDark = document.documentElement.classList.contains('dark');
  
  // Toggle theme
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
  
  // Dispatch event for components to listen to
  window.dispatchEvent(new CustomEvent('themeChanged'));
  
  return !isDark; // Return new state
}