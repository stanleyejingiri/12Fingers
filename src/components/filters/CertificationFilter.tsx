import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CertificationFilterProps {
  requireCertification: boolean;
  onRequireCertificationChange: (value: boolean) => void;
}

export const CertificationFilter = ({ 
  requireCertification, 
  onRequireCertificationChange 
}: CertificationFilterProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="certification"
        checked={requireCertification}
        onCheckedChange={(checked) => onRequireCertificationChange(checked as boolean)}
      />
      <Label 
        htmlFor="certification" 
        className="text-sm font-medium text-gray-700 cursor-pointer"
      >
        Has Certifications
      </Label>
    </div>
  );
};