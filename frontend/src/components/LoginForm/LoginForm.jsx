import { Button } from '../Button/button';

// Replace login button with:
<Button
  type="submit"
  color="blue"
  className="w-full"
  disabled={loading}
>
  {loading ? 'Logging in...' : 'Log In'}
</Button>