import { Button } from '../Button/button';

// Replace confirm/cancel buttons with:
<div className="flex justify-end gap-3 mt-6">
  <Button
    onClick={onCancel}
    color="zinc"
    outline
  >
    Cancel
  </Button>
  <Button
    onClick={onConfirm}
    color="red"
  >
    Delete
  </Button>
</div>