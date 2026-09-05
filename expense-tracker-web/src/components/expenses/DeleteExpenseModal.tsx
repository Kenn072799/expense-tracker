import {
  LoaderCircle,
  TriangleAlert,
  Trash2,
} from "lucide-react";

import Modal from "../Modal";
import type { ExpenseResponse } from "../../types/expense";

interface DeleteExpenseModalProps {
  expense: ExpenseResponse | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteExpenseModal({
  expense,
  deleting,
  onClose,
  onConfirm,
}: DeleteExpenseModalProps) {
  return (
    <Modal
      isOpen={expense !== null}
      title="Delete Expense"
      maxWidth="max-w-md"
      onClose={() => {
        if (!deleting) {
          onClose();
        }
      }}
    >
      {expense && (
        <div>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <TriangleAlert className="h-6 w-6 text-red-600" />
          </div>

          <h3 className="font-semibold text-gray-900">
            Delete this expense?
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            This expense will be permanently removed.
          </p>

          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">
                  {expense.description ||
                    expense.categoryName}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {expense.categoryName}
                </p>
              </div>

              <p className="font-semibold text-gray-900">
                ₱
                {expense.amount.toLocaleString(
                  "en-PH",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              disabled={deleting}
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={deleting}
              onClick={onConfirm}
              className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Expense
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}