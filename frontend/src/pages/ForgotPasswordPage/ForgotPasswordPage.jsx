import { useState } from 'react';
import { Link } from 'react-router';
import * as authService from '../../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message);
      setIsSubmitted(true);
      setIsError(false);
    } catch (err) {
      setMessage('Failed to process your request. Please try again.');
      setIsError(true);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 py-8 pt-4 pl-4 pr-4 pb-1 sm:px-6 lg:px-8">
      <form 
        onSubmit={handleSubmit} 
        className="grid w-full grid-cols-1 gap-6 px-4"
      >
        <img 
          src="/images/nnl_logo_v2_trans_bg.png" 
          alt="NomNomLog Logo" 
          className="w-[250px] h-[250px] mx-auto" 
        />
        
        <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white pb-7">
          Reset your password
        </h1>
        
        {message && (
          <div className={`rounded-md ${isError ? 'bg-red-50 dark:bg-red-900' : 'bg-green-50 dark:bg-green-900'} p-4`}>
            <p className={`text-sm ${isError ? 'text-red-700 dark:text-red-200' : 'text-green-700 dark:text-green-200'}`}>
              {message}
            </p>
          </div>
        )}
        
        {!isSubmitted ? (
          <>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-10 px-4 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 mb-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send reset link
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Check your email for a password reset link.
            </p>
          </div>
        )}
        
        <div className="flex justify-center space-x-4 pt-5">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}