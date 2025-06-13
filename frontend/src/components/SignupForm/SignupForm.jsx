import { Button } from '../catalyst/button';

// Replace signup button with:
<Button
  type="submit"
  color="blue"
  className="w-full"
  disabled={loading}
>
  {loading ? 'Creating Account...' : 'Sign Up'}
</Button>