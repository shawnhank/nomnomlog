import { useState } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService';
import { AuthLayout } from '../../components/catalyst/auth-layout';
import { Button } from '../../components/catalyst/button';
import { Field, Label, ErrorMessage } from '../../components/catalyst/fieldset';
import { Input } from '../../components/catalyst/input';
import { Checkbox, CheckboxField } from '../../components/catalyst/checkbox';
import { Heading } from '../../components/catalyst/heading';
import { Text, TextLink } from '../../components/catalyst/text';

export default function SignUpPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirm: '',
    newsletter: false
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  function handleChange(evt) {
    const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
    setFormData({ ...formData, [evt.target.name]: value });
    setErrorMsg('');
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      delete dataToSubmit.confirm;
      const user = await signUp(dataToSubmit);
      setUser(user);
      navigate('/posts');
    } catch {
      setErrorMsg('Sign Up Failed - Try Again');
    }
  }

  const disable = formData.password !== formData.confirm;

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex justify-center">
              <img
                className="logo-size"
                src="/images/nnl_logo_v1_trans_bg.png"
                alt="NomNomLog"
              />
            </div>

            <Heading level={1} className="text-center text-2xl font-semibold">
              Create your account
            </Heading>

            {errorMsg && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                {errorMsg}
              </div>
            )}

            <div>
              <Field className="custom-input-height form-field-spacing">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </Field>

              <Field className="custom-input-height form-field-spacing">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </Field>

              <Field className="custom-input-height form-field-spacing">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </Field>

              <Field className="custom-input-height form-field-spacing">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirm}
                  onChange={handleChange}
                />
                {disable && formData.confirm && (
                  <ErrorMessage>Passwords do not match</ErrorMessage>
                )}
              </Field>

              <CheckboxField className="checkbox-spacing">
                <Checkbox
                  id="newsletter"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                />
                <Label htmlFor="newsletter" className="select-none">
                  Get emails about product updates and news
                </Label>
              </CheckboxField>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                disabled={disable}
                color="indigo"
                className="w-full"
              >
                Create account
              </Button>
            </div>

            <Text className="text-center text-sm">
              Already have an account?{' '}
              <TextLink to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Sign in
              </TextLink>
            </Text>
          </div>
        </form>
      </AuthLayout>
  );
}
