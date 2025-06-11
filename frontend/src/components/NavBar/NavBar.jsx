import { NavLink, Link, useNavigate } from 'react-router';
import { logOut } from '../../services/authService';
import { toggleTheme } from '../../utils/themeUtils';
import { useState, useEffect } from 'react';

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function handleLogOut() {
    logOut();
    setUser(null);
    // The <Link> that was clicked will navigate to "/"
  }

  function handleToggleTheme() {
    toggleTheme();
    setIsDark(!isDark);
  }

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 shadow-sm">
      <div className="flex items-center space-x-1 text-sm">
        <NavLink 
          to="/"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md font-medium transition-colors ${
              isActive 
                ? 'bg-gray-900 text-white dark:bg-gray-700' 
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`
          }
        >
          Home
        </NavLink>
        {user ? (
          <>
            <NavLink 
              to="/restaurants"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive 
                    ? 'bg-gray-900 text-white dark:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
            >
              Restaurants
            </NavLink>
            <NavLink 
              to="/meals"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive 
                    ? 'bg-gray-900 text-white dark:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
            >
              Meals
            </NavLink>
          </>
        ) : (
          <>
            <NavLink 
              to="/login"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive 
                    ? 'bg-gray-900 text-white dark:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
            >
              Log In
            </NavLink>
            <NavLink 
              to="/signup"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive 
                    ? 'bg-gray-900 text-white dark:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
            >
              Sign Up
            </NavLink>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <>
            <Link 
              to="/profile" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Welcome, {user.name}
            </Link>
            <Link 
              to="/" 
              onClick={handleLogOut}
              className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Log Out
            </Link>
          </>
        )}
        
        <button 
          onClick={handleToggleTheme}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
