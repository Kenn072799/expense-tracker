import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <main
      className={`px-4 py-6 sm:px-6 sm:py-8 xl:px-10 ${className}`}
    >
      <div className="mx-auto max-w-360">
        {children}
      </div>
    </main>
  );
}
