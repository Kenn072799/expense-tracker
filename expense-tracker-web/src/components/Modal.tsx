import { useEffect } from "react";

import { X } from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  maxWidth = "max-w-lg",
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          className="fixed inset-0 z-60 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 16,
              scale: 0.98,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`max-h-[92vh] w-full ${maxWidth} overflow-hidden rounded-t-3xl border border-white/50 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.25)] sm:max-h-[90vh] sm:rounded-3xl`}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
              <div className="min-w-0">
                <h2
                  id="modal-title"
                  className="truncate text-lg font-semibold text-gray-900"
                >
                  {title}
                </h2>
              </div>

              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.92,
                }}
                className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label={`Close ${title}`}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="max-h-[calc(92vh-73px)] overflow-y-auto p-5 sm:max-h-[calc(90vh-73px)] sm:p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
