import { Button } from '../catalyst/button';

// Replace the submit button in the form with:
<div className="flex justify-end mt-6">
  <Button
    type="submit"
    color="blue"
    disabled={loading}
  >
    {loading ? 'Saving...' : buttonLabel}
  </Button>
</div>
