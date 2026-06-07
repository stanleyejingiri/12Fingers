import { CertificationFilter } from "./CertificationFilter";
import { WarrantyFilter } from "./WarrantyFilter";

interface CertificationWarrantyGroupProps {
  requireCertification: boolean;
  onRequireCertificationChange: (value: boolean) => void;
  requireWarranty: boolean;
  onRequireWarrantyChange: (value: boolean) => void;
}

export const CertificationWarrantyGroup = ({
  requireCertification,
  onRequireCertificationChange,
  requireWarranty,
  onRequireWarrantyChange,
}: CertificationWarrantyGroupProps) => {
  return (
    <div className="flex flex-wrap gap-4 sm:gap-6">
      <CertificationFilter
        requireCertification={requireCertification}
        onRequireCertificationChange={onRequireCertificationChange}
      />
      <WarrantyFilter
        requireWarranty={requireWarranty}
        onRequireWarrantyChange={onRequireWarrantyChange}
      />
    </div>
  );
};
