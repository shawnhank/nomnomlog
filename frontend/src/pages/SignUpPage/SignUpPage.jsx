import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { signUp } from '../../services/authService';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';

export default function SignUpPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirm: '',
    newsletter: false,
    userImages: [] // Add this field
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  function handleChange(evt) {
    const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
    setFormData({ ...formData, [evt.target.name]: value });
    setErrorMsg('');
  }

  // Handle image updates from MultiImageUploader
  function handleImagesUpdated(updatedData) {
    setFormData({
      ...formData,
      ...updatedData
    });
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      delete dataToSubmit.confirm;
      const user = await signUp(dataToSubmit);
      setUser(user);
      navigate('/posts');
    } catch (err) {
      setErrorMsg('Sign Up Failed - Try Again');
    }
  }

  const disable = formData.password !== formData.confirm;

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 py-8 pt-4 pl-4 pr-4 pb-1 sm:px-6 lg:px-8">
      <form 
        onSubmit={handleSubmit} 
        className="grid w-full grid-cols-1 gap-6 px-4"
      >
        <img src="/images/nnl_logo_v2_trans_bg.png" alt="NomNomLog Logo" className="w-[250px] h-[250px] mx-auto" />
        
        <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white pb-7 ">
          Create your account
        </h1>
        
        {errorMsg && (
          <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
            <p className="text-sm text-red-700 dark:text-red-200">{errorMsg}</p>
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-base font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 h-10 px-4 block w-full rounded-md border-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="fullName" className="block text-base font-medium text-gray-700 dark:text-gray-300">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 h-10 px-4 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-base font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 h-10 px-4 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="confirm" className="block text-base font-medium text-gray-700 dark:text-gray-300">
            Confirm password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirm}
            onChange={handleChange}
            className="mt-1 h-10 px-4 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div className="flex justify-center items-center mt-3">
          <input
            id="newsletter"
            name="newsletter"
            type="checkbox"
            checked={formData.newsletter}
            onChange={handleChange}
            className="h-4 w-4 mb-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700"
          />
          <label htmlFor="newsletter" className="mb-3 px-2 block text-sm text-gray-700 dark:text-gray-300">
            Get emails about product updates and news
          </label>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photos</label>
          <MultiImageUploader 
            images={formData.userImages} 
            onImagesUpdated={handleImagesUpdated}
            entityType="user"
          />
        </div>
        
        <button
          type="submit"
          disabled={disable}
          className="w-full flex justify-center py-2 px-4 mb-3border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 dark:disabled:bg-gray-600"
        >
          Create account
        </button>
        
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-5">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
