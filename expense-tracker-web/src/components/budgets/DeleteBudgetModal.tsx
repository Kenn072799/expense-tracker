import {
  CalendarDays,
  LoaderCircle,
  TriangleAlert,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

import Modal from "../Modal";

import type { Budget } from "../../types/budget";

interface DeleteBudgetModalProps {
  budget: Budget | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteBudgetModal({
  budget,
  deleting,
  onClose,
  onConfirm,
}: DeleteBudgetModalProps) {
  if (!budget) {
    return null;
  }

  const period = new Date(
    budget.year,
    budget.month - 1,
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Modal
      isOpen={budget !== null}
      title="Delete Budget"
      maxWidth="max-w-md"
      onClose={() => {
        if (!deleting) {
          onClose();
        }
      }}
    >
      <div>
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.85,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50"
          >
            <TriangleAlert className="h-7 w-7 text-red-600" />
          </motion.div>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Delete this budget?
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            This monthly budget will be permanently removed.
          </p>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.05,
            ease: "easeOut",
          }}
          className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">
                {budget.categoryName}
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                <CalendarDays className="h-4 w-4" />
                {period}
              </div>
            </div>

            <p className="shrink-0 text-base font-bold tracking-tight text-gray-900">
              ₱
              {budget.amount.toLocaleString(
                "en-PH",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}
            </p>
          </div>
        </motion.div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-3">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

          <p className="text-xs leading-5 text-red-600">
            This action cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <motion.button
            type="button"
            disabled={deleting}
            onClick={onClose}
            whileTap={
              deleting
                ? undefined
                : { scale: 0.97 }
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </motion.button>

          <motion.button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            whileHover={
              deleting
                ? undefined
                : { y: -1 }
            }
            whileTap={
              deleting
                ? undefined
                : { scale: 0.97 }
            }
            className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Budget
              </>
            )}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}