import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface WarrantyFilterProps {
  requireWarranty: boolean;
  onRequireWarrantyChange: (value: boolean) => void;
}

export const WarrantyFilter = ({ 
  requireWarranty, 
  onRequireWarrantyChange 
}: WarrantyFilterProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="warranty"
        checked={requireWarranty}
        onCheckedChange={(checked) => onRequireWarrantyChange(checked as boolean)}
      />
      <Label 
        htmlFor="warranty" 
        className="text-sm font-medium text-gray-700 cursor-pointer"
      >
        Offers Warranty
      </Label>
    </div>
  );
};