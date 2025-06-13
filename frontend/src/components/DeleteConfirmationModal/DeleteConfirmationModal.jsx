import { Dialog, DialogTitle, DialogBody, DialogActions } from '../catalyst/dialog';
import { Button } from '../catalyst/button';

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = ""
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} size="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogBody>
        <p className="text-gray-700 dark:text-gray-300">
          {itemName ? message.replace('this item', itemName) : message}
        </p>
      </DialogBody>
      <DialogActions>
        <Button
          onClick={onClose}
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
      </DialogActions>
    </Dialog>
  );
}
