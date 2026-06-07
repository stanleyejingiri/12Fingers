//src/components/filters/AdvancedFiltersToggle.tsx
import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface AdvancedFiltersToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AdvancedFiltersToggle = ({ isOpen, onToggle }: AdvancedFiltersToggleProps) => {
  return (
    /*<button
      onClick={onToggle}
      className="flex items-center text-sm text-gray-600 hover:text-gray-900"
    >
      {isOpen ? "Hide Advanced Filters" : "Show Advanced Filters"}
    </button>*/
	/*<button onClick={onToggle} className="flex items-center gap-1 text-sm text-gray-600">
	  {isOpen ? '▲' : '▼'}
	  <span>Advanced Search</span>
	</button>*/
	
	<button onClick={onToggle} className="flex items-center gap-1 text-sm text-gray-600">
	  <SlidersHorizontal className="h-4 w-4" />
	  <span>Advanced Search</span>
	</button>
		
	
  );
};