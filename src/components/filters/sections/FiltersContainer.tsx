import { ReactNode } from "react";

interface FiltersContainerProps {
  children: ReactNode;
}

export const FiltersContainer = ({ children }: FiltersContainerProps) => {
  return (
    <div className="space-y-4 bg-white rounded-lg shadow-sm border animate-fade-in">
      {children}
    </div>
  );
};