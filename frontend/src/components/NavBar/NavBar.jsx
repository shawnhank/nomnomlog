import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { NavLink, Link, useNavigate } from 'react-router'
import { logOut } from '../../services/authService'
import { toggleTheme } from '../../utils/themeUtils'
import { useState, useEffect } from 'react'
import { Button } from '../catalyst/button'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  function handleLogOut() {
    logOut()
    setUser(null)
    navigate('/login') // Redirect to login page instead of home
  }

  function handleToggleTheme() {
    toggleTheme()
    setIsDark(!isDark)
  }

  // Define navigation based on user authentication status
  const navigation = user 
    ? [
        { name: 'Home', href: '/', current: false },
        { name: 'Restaurants', href: '/restaurants', current: false },
        { name: 'Meals', href: '/meals', current: false },
      ]
    : [
        { name: 'Home', href: '/', current: false },
        { name: 'Log In', href: '/login', current: false },
        { name: 'Sign Up', href: '/signup', current: false },
      ]

  return (
    <Disclosure as="nav" className="bg-white dark:bg-gray-800 shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-hidden">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center">
                  <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
                    NomNomLog
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) => classNames(
                          isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Theme toggle button */}
                <Button
                  onClick={handleToggleTheme}
                  color="zinc"
                  plain
                  icon={isDark ? SunIcon : MoonIcon}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                />

                {/* User menu - only shown when logged in */}
                {user && (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex items-center rounded-full text-sm focus:outline-hidden">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <div className="flex items-center">
                          <span className="hidden sm:inline-block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                            {user.name}
                          </span>
                          {user.userImages && user.userImages.length > 0 ? (
                            <img 
                              src={user.userImages[0].url} 
                              alt={user.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 py-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-hidden"
                    >
                      <MenuItem>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          Edit Profile
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Button
                          onClick={handleLogOut}
                          color="zinc"
                          plain
                        >
                          Log Out
                        </Button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                )}
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={NavLink}
                  to={item.href}
                  className={({ isActive }) => classNames(
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}
