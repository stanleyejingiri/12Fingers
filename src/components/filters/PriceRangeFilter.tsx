//src/src/components/filters/PriceRangeFilter.tsx
/*import { Input } from "@/components/ui/input";
import { PriceRangeFilterProps } from "./types";

export const PriceRangeFilter = ({ minPrice, maxPrice, onPriceChange }: PriceRangeFilterProps) => {
  return (
    <div className="md:col-span-1">
      <label htmlFor="price" className="text-sm font-medium mb-2 block text-gray-700">
        Price Range ($/hour)
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
            placeholder="Min"
            className="w-full pl-7"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        </div>
        <span className="text-gray-500">-</span>
        <div className="relative flex-1">
          <Input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
            placeholder="Max"
            className="w-full pl-7"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        </div>
      </div>
    </div>
  );
};*/
//src/components/filters/PriceRangeFilter.tsx
import { Input } from "@/components/ui/input";
import { PriceRangeFilterProps } from "./types";
import { Slider } from "@/components/ui/slider";

export const PriceRangeFilter = ({ minPrice, maxPrice, onPriceChange }: PriceRangeFilterProps) => {
  const MAX_PRICE = 1000; // Maximum price limit

  const handleSliderChange = (values: number[]) => {
    if (values.length === 2) {
      onPriceChange(values[0], values[1]);
    }
  };

  return (
    <div className="md:col-span-1">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="price" className="text-sm font-medium text-gray-700">
          Price Range ($/hour)
        </label>
        <span className="text-sm text-gray-500">
          ${minPrice} - ${maxPrice === MAX_PRICE ? `${MAX_PRICE}+` : maxPrice}
        </span>
      </div>
      
      {/* Slider with meter */}
      <div className="mb-4">
        <Slider
          value={[minPrice, maxPrice]}
          min={0}
          max={MAX_PRICE}
          step={10}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>$0</span>
          <span>${MAX_PRICE}+</span>
        </div>
      </div>

      {/* Input fields for precise control */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="number"
            min={0}
            max={MAX_PRICE}
            value={minPrice}
            onChange={(e) => {
              const newMin = Math.min(Number(e.target.value), maxPrice);
              onPriceChange(newMin, maxPrice);
            }}
            placeholder="Min"
            className="w-full pl-7"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        </div>
        <span className="text-gray-500">-</span>
        <div className="relative flex-1">
          <Input
            type="number"
            min={minPrice}
            max={MAX_PRICE}
            value={maxPrice}
            onChange={(e) => {
              const newMax = Math.max(Number(e.target.value), minPrice);
              onPriceChange(minPrice, Math.min(newMax, MAX_PRICE));
            }}
            placeholder="Max"
            className="w-full pl-7"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        </div>
      </div>
    </div>
  );
};
