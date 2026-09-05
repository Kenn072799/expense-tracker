import Modal from "../Modal";
import CreateRecurringExpenseForm from "./CreateRecurringExpenseForm";

import type { CategoryResponse } from "../../types/category";
import type { CreateRecurringExpenseRequest } from "../../types/recurringExpense";

interface Props {
  isOpen: boolean;
  categories: CategoryResponse[];
  submitting: boolean;

  onCreate: (
    request: CreateRecurringExpenseRequest,
  ) => Promise<void>;

  onClose: () => void;

  onError: (
    message: string,
  ) => void;
}

export default function CreateRecurringExpenseModal({
  isOpen,
  categories,
  submitting,
  onCreate,
  onClose,
  onError,
}: Props) {
  function handleClose() {
    if (submitting) {
      return;
    }

    onError("");
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Add Recurring Expense"
      maxWidth="max-w-2xl"
      onClose={handleClose}
    >
      <CreateRecurringExpenseForm
        categories={categories}
        submitting={submitting}
        onCreate={onCreate}
        onCancel={handleClose}
        onError={onError}
      />
    </Modal>
  );
}