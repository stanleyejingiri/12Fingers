import { ReactNode } from "react";

interface FilterRowProps {
  children: ReactNode;
  className?: string;
}

export const FilterRow = ({ children, className = "" }: FilterRowProps) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {children}
    </div>
  );
};