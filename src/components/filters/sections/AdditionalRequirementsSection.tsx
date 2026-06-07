import { CertificationWarrantyGroup } from "../CertificationWarrantyGroup";

interface AdditionalRequirementsSectionProps {
  requireCertification: boolean;
  onRequireCertificationChange: (value: boolean) => void;
  requireWarranty: boolean;
  onRequireWarrantyChange: (value: boolean) => void;
}

export const AdditionalRequirementsSection = ({
  requireCertification,
  onRequireCertificationChange,
  requireWarranty,
  onRequireWarrantyChange,
}: AdditionalRequirementsSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Additional Requirements</h2>
      <CertificationWarrantyGroup
        requireCertification={requireCertification}
        onRequireCertificationChange={onRequireCertificationChange}
        requireWarranty={requireWarranty}
        onRequireWarrantyChange={onRequireWarrantyChange}
      />
    </div>
  );
};