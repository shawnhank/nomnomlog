import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { getUser } from '../../services/authService';
import HomePage from '../HomePage/HomePage';
import PostListPage from '../PostListPage/PostListPage';
import NewPostPage from '../NewPostPage/NewPostPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import RestaurantListPage from '../RestaurantListPage/RestaurantListPage';
import RestaurantDetailPage from '../RestaurantDetailPage/RestaurantDetailPage';
import NewRestaurantPage from '../NewRestaurantPage/NewRestaurantPage';
import EditRestaurantPage from '../EditRestaurantPage/EditRestaurantPage';
import MealListPage from '../MealListPage/MealListPage';
import MealDetailPage from '../MealDetailPage/MealDetailPage';
import NewMealPage from '../NewMealPage/NewMealPage';
import EditMealPage from '../EditMealPage/EditMealPage';
import TagsPage from '../TagsPage/TagsPage';
import NavBar from '../../components/NavBar/NavBar';
import { useEffect } from 'react';
import { initializeTheme } from "../../utils/themeUtils";
import ForgotPasswordPage from '../ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from '../ResetPasswordPage/ResetPasswordPage';

export default function App() {
  const [user, setUser] = useState(getUser());
  
  useEffect(() => {
    initializeTheme();
    
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Get the user from localStorage
      const userFromStorage = localStorage.getItem('user');
      
      if (userFromStorage) {
        // Parse the user data and set it in state
        setUser(JSON.parse(userFromStorage));
      } else {
        // If we have a token but no user data, use getUser()
        const userData = getUser();
        if (userData) {
          setUser(userData);
          // Store user data in localStorage for future refreshes
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    }
  }, []);

  return user ? (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar user={user} setUser={setUser} />
      <main className="flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/new" element={<NewPostPage />} />
          <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
          
          {/* Restaurant routes */}
          <Route path="/restaurants" element={<RestaurantListPage />} />
          <Route path="/restaurants/new" element={<NewRestaurantPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route path="/restaurants/:id/edit" element={<EditRestaurantPage />} />
          
          {/* Meal routes */}
          <Route path="/meals" element={<MealListPage />} />
          <Route path="/meals/new" element={<NewMealPage />} />
          <Route path="/meals/:id" element={<MealDetailPage />} />
          <Route path="/meals/:id/edit" element={<EditMealPage />} />

          {/* Tags routes */}
          <Route path="/tags" element={<TagsPage />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  ) : (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
      <Route path="/login" element={<LogInPage setUser={setUser} />} /> 
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
