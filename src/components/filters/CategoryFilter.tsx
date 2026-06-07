import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryFilterProps } from "./types";
import { WorkerCategory } from "@/types/worker";

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const categories: WorkerCategory[] = [
    "Cleaner",
    "Landscaper",
    "Electrician",
    "Plumber",
    "Mechanic",
    "Tiler",
    "Mason",
    "Other"
  ];

  return (
    <div className="md:col-span-1">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Worker Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};