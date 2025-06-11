import { useState } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService';
import { AuthLayout } from '../../components/catalyst/auth-layout';
import { Button } from '../../components/catalyst/button';
import { Checkbox, CheckboxField } from '../../components/catalyst/checkbox';
import { Field, Label, ErrorMessage } from '../../components/catalyst/fieldset';
import { Heading } from '../../components/catalyst/heading';
import { Input } from '../../components/catalyst/input';
import { Strong, Text, TextLink } from '../../components/catalyst/text';

export default function SignUp2Page({ setUser }) {
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
      <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
        <img 
          className="logo-size mx-auto" 
          src="/images/nnl_logo_v1_trans_bg.png" 
          alt="NomNomLog" 
        />
        
        <Heading>Create your account</Heading>
        
        {errorMsg && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-900 ring-1 ring-inset ring-red-200 dark:bg-red-900/10 dark:text-red-400 dark:ring-red-900/20">
            {errorMsg}
          </div>
        )}
        
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input 
            type="email" 
            id="email"
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </Field>
        
        <Field>
          <Label htmlFor="fullName">Full name</Label>
          <Input 
            id="fullName"
            name="fullName" 
            value={formData.fullName}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </Field>
        
        <Field>
          <Label htmlFor="password">Password</Label>
          <Input 
            type="password" 
            id="password"
            name="password" 
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password" 
          />
        </Field>
        
        <Field>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input 
            type="password" 
            id="confirm"
            name="confirm" 
            value={formData.confirm}
            onChange={handleChange}
            required
            autoComplete="new-password" 
          />
          {disable && formData.confirm && (
            <ErrorMessage>Passwords do not match</ErrorMessage>
          )}
        </Field>
        
        <CheckboxField>
          <Checkbox 
            id="newsletter"
            name="newsletter" 
            checked={formData.newsletter}
            onChange={handleChange}
          />
          <Label htmlFor="newsletter">Get emails about product updates and news.</Label>
        </CheckboxField>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={disable}
          color="blue"
        >
          Create account
        </Button>
        
        <Text>
          Already have an account?{' '}
          <TextLink to="/login">
            <Strong>Sign in</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
}