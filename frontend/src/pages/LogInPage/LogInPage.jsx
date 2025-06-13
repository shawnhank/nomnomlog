import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import * as authService from '../../services/authService';
import { Button } from '../../components/catalyst/button';
import { Input } from '../../components/catalyst/input';
import { Checkbox } from '../../components/catalyst/checkbox';
import { Fieldset } from '../../components/catalyst/fieldset';

export default function LogInPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const user = await authService.logIn(formData);
      setUser(user);
      navigate('/posts');
    } catch (err) {
      setErrorMsg('Log In Failed - Try Again');
    }
  }

  function handleChange(evt) {
    const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
    setFormData({ ...formData, [evt.target.name]: value });
    setErrorMsg('');
  }

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 py-4 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="/images/nnl_logo_v2_trans_bg.png"
            alt="NomNomLog Logo"
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto"
          />
          <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to your account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
              <p className="text-sm text-red-700 dark:text-red-200">{errorMsg}</p>
            </div>
          )}

          <Fieldset>
            <div className="space-y-4">
              <Input
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </Fieldset>

          <Fieldset>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Password</span>
                  <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>

              <Checkbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              >
                Remember me
              </Checkbox>
            </div>
          </Fieldset>

          <Button
            type="submit"
            color="blue"
            className="w-full"
          >
            Sign in
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
