import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { signUp } from '../../services/authService';
import MultiImageUploader from '../../components/MultiImageUploader/MultiImageUploader';
import { Button } from '../../components/catalyst/button';
import { Input } from '../../components/catalyst/input';
import { Checkbox } from '../../components/catalyst/checkbox';
import { Fieldset, Legend } from '../../components/catalyst/fieldset';

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
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 py-4 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="/images/nnl_logo_v2_trans_bg.png"
            alt="NomNomLog Logo"
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto"
          />
          <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
              <p className="text-sm text-red-700 dark:text-red-200">{errorMsg}</p>
            </div>
          )}

          <Fieldset>
            <Legend>Account Information</Legend>
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

              <Input
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
          </Fieldset>

          <Fieldset>
            <Legend>Security</Legend>
            <div className="space-y-4">
              <Input
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />

              <Input
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirm}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </div>
          </Fieldset>

          <Fieldset>
            <Legend>Profile & Preferences</Legend>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Profile Photos
                </label>
                <MultiImageUploader
                  images={formData.userImages}
                  onImagesUpdated={handleImagesUpdated}
                  entityType="user"
                />
              </div>

              <Checkbox
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
              >
                Get emails about product updates and news
              </Checkbox>
            </div>
          </Fieldset>

          <Button
            type="submit"
            disabled={disable}
            color="blue"
            className="w-full"
          >
            Create account
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
