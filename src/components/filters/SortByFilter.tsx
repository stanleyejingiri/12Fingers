import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortByFilterProps } from "./types";

export const SortByFilter = ({ sortBy, onSortChange }: SortByFilterProps) => {
  return (
    <div className="md:col-span-1">
      <label htmlFor="sort" className="text-sm font-medium mb-2 block text-gray-700">
        Sort By
      </label>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rating">Highest Rating</SelectItem>
          <SelectItem value="rating_asc">Lowest Rating</SelectItem>
          <SelectItem value="price">Lowest Price</SelectItem>
          <SelectItem value="price_desc">Highest Price</SelectItem>
          <SelectItem value="experience">Most Experienced</SelectItem>
          <SelectItem value="experience_asc">Newly Started</SelectItem>
          <SelectItem value="distance">Nearest</SelectItem>
          <SelectItem value="distance_desc">Furthest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};