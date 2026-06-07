import React from "react";
import { Award } from "lucide-react";
import { Certification } from "@/types/worker";

interface WorkerCertificationsProps {
  certifications: Certification[];
}

export const WorkerCertifications = ({ certifications }: WorkerCertificationsProps) => {
  if (!certifications?.length) return null;

  return (
    <div className="border-t pt-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Award className="h-5 w-5" />
        Certifications
      </h2>
      <div className="grid gap-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium">{cert.name}</h3>
            <p className="text-sm text-muted-foreground">Issued by: {cert.issuedBy}</p>
            <p className="text-sm text-muted-foreground">
              Issued: {new Date(cert.issueDate).toLocaleDateString()}
              {cert.expiryDate && ` (Expires: ${new Date(cert.expiryDate).toLocaleDateString()})`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};