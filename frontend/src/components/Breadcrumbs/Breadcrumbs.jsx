import React from 'react'
import { useMatches, Link } from 'react-router'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'

/**
 * Breadcrumbs component that auto-generates from React Router v7+ routes.
 * Supports optional icons per route via handle.breadcrumb.icon.
 * Responsive scroll and dark mode styling included.
 */
export default function Breadcrumbs() {
  const matches = useMatches()

  const crumbs = matches
    .filter(match => match.handle && match.handle.breadcrumb)
    .map(match => {
      const { name, icon: Icon } = match.handle.breadcrumb
      return {
        name,
        Icon,
        href: match.pathname,
        current: match.pathname === window.location.pathname,
      }
    })

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
          <li key={crumb.name} className="flex items-center">
            <ChevronRightIcon className="mx-2 size-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            <Link
              to={crumb.href}
              aria-current={crumb.current ? 'page' : undefined}
              className="flex items-center gap-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              {crumb.Icon && <crumb.Icon className="size-4 shrink-0" aria-hidden="true" />}
              {crumb.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}