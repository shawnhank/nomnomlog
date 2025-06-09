import { useState } from 'react';
import { Routes, Route } from 'react-router';
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
import NavBar from '../../components/NavBar/NavBar';
import './App.css';

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        {user ? (
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
            
            <Route path="*" element={null} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
            <Route path="/login" element={<LogInPage setUser={setUser} />} />
            <Route path="*" element={null} />
          </Routes>
        )}
      </section>
    </main>
  );
}

