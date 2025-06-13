import React from 'react';
import { Link, useLocation } from 'react-router';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

/**
 * Simple breadcrumbs component that generates breadcrumbs based on the current URL path
 */
export default function SimpleBreadcrumbs({ customCrumbs }) {
  const location = useLocation();
  
  // If custom crumbs are provided, use those
  const crumbs = customCrumbs || generateCrumbsFromPath(location.pathname);
  
  return (
    <nav aria-label="Breadcrumb" className="flex overflow-x-auto whitespace-nowrap py-2 px-4">
      <ol role="list" className="flex items-center space-x-4 text-sm">
        <li>
          <Link to="/" className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-white">
            <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.path} className="flex items-center">
            <ChevronRightIcon className="mx-2 size-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            <Link
              to={crumb.path}
              aria-current={crumb.current ? 'page' : undefined}
              className="flex items-center gap-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              {crumb.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Helper function to generate breadcrumbs from a URL path
function generateCrumbsFromPath(path) {
  const segments = path.split('/').filter(Boolean);
  
  return segments.map((segment, index) => {
    // Create a path up to this segment
    const segmentPath = '/' + segments.slice(0, index + 1).join('/');
    
    // Format the segment name (capitalize, replace hyphens with spaces)
    let name = segment.replace(/-/g, ' ');
    
    // Handle IDs - if it's a UUID or ObjectId, replace with a more user-friendly label
    if (segment.match(/^[0-9a-f]{24}$/) || segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      // If this is an ID and the previous segment exists, use that as context
      if (index > 0) {
        // Remove trailing 's' if it exists (e.g., "meals" -> "meal")
        const contextName = segments[index - 1].replace(/s$/, '');
        name = `${contextName} details`;
      } else {
        name = 'Details';
      }
    } else {
      // Capitalize first letter of each word
      name = name.replace(/\b\w/g, l => l.toUpperCase());
    }
    
    return {
      name,
      path: segmentPath,
      current: index === segments.length - 1
    };
  });
}