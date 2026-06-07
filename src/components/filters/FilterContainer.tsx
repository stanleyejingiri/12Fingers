import { ReactNode } from "react";

interface FilterContainerProps {
  children: ReactNode;
}

export const FilterContainer = ({ children }: FilterContainerProps) => {
  return (
    <div className="space-y-4 bg-white rounded-lg shadow-sm border animate-fade-in">
      {children}
    </div>
  );
};
