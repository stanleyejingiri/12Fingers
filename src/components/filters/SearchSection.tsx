import React from "react";

interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const SearchSection = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: SearchSectionProps) => {
  return (
    <div>
      <label 
        htmlFor="search-input" 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Search for Workers By:
      </label>
      <div className="flex gap-4">
        <input
          id="search-input"
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="By name"
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          aria-label="Search workers by name"
        />
        
        <select
          id="category-select"
          name="category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          aria-label="Filter workers by category"
        >
          <option value="">By categories</option>
          <option value="Cleaner">Cleaner</option>
          <option value="Landscaper">Landscaper</option>
          <option value="Electrician">Electrician</option>
          <option value="Plumber">Plumber</option>
          <option value="Mechanic">Mechanic</option>
          <option value="Tiler">Tiler</option>
          <option value="Mason">Mason</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );
};
