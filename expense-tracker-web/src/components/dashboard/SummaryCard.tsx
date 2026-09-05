import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface SummaryCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  iconClassName?: string;
  iconBackgroundClassName?: string;
  index?: number;
}

export default function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName = "text-blue-600",
  iconBackgroundClassName = "bg-blue-50",
  index = 0,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      whileHover={{
        y: -3,
      }}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-3 truncate text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>

        <motion.div
          whileHover={{
            rotate: -5,
            scale: 1.05,
          }}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBackgroundClassName}`}
        >
          <Icon
            className={`h-5 w-5 ${iconClassName}`}
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-gray-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}