import { ReactNode } from "react";

interface FilterGroupProps {
  children: ReactNode;
  className?: string;
}

export const FilterGroup = ({ children, className = "" }: FilterGroupProps) => {
  return (
    <div className={`space-y-6 p-4 bg-white rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  );
};