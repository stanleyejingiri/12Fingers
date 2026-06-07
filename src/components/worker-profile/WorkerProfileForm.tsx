// src/components/worker-profile/WorkerProfileForm.tsx
import React, { useEffect } from "react";  // ← add useEffect
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkerProfile } from "@/types/worker";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { ExperienceSection } from "./form-sections/ExperienceSection";
import { ContactSection } from "./form-sections/ContactSection";
import { WarrantySection } from "./form-sections/WarrantySection";
import { workerProfileFormSchema, WorkerProfileFormValues } from "./types";

interface WorkerProfileFormProps {
  worker?: WorkerProfile;
  onSuccess?: () => void;
  onUpdate?: (updatedData: Partial<WorkerProfile>) => void;
}

export const WorkerProfileForm = ({ worker, onSuccess, onUpdate }: WorkerProfileFormProps) => {
  const { toast } = useToast();
  const form = useForm<WorkerProfileFormValues>({
    resolver: zodResolver(workerProfileFormSchema),
    defaultValues: {
      name: worker?.name || "",
      category: worker?.category || "Other",
      yearsOfExperience: worker?.yearsOfExperience || 0,
      hourlyRate: worker?.hourlyRate || 0,
      contactPhone: worker?.contactPhone || worker?.contact_phone || "",
      contactEmail: worker?.contactEmail || worker?.contact_email || "",
      description: worker?.description || "",
      offersWarranty: worker?.offersWarranty || false,
      warrantyDetails: worker?.warrantyDetails || "",
    },
  });

  // 🔴 RESET FORM WHEN WORKER CHANGES
  useEffect(() => {
    if (worker) {
      form.reset({
        name: worker.name || "",
        category: worker.category || "Other",
        yearsOfExperience: worker.yearsOfExperience || 0,
        hourlyRate: worker.hourlyRate || 0,
        contactPhone: worker.contactPhone || worker.contact_phone || "",
        contactEmail: worker.contactEmail || worker.contact_email || "",
        description: worker.description || "",
        offersWarranty: worker.offersWarranty || false,
        warrantyDetails: worker.warrantyDetails || "",
      });
    }
  }, [worker, form]);

  const onSubmit = async (values: WorkerProfileFormValues) => {
    if (!worker?.id) {
      toast({
        title: "Error",
        description: "No worker profile found",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("🔍 Submitting worker profile data:", values);
      
      const response = await fetch(`http://localhost:3001/api/workers/${worker.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          category: values.category,
          years_of_experience: values.yearsOfExperience,
          hourly_rate: values.hourlyRate,
          contact_phone: values.contactPhone,
          contact_email: values.contactEmail,
          description: values.description,
          offers_warranty: values.offersWarranty,
          warranty_details: values.warrantyDetails,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }

      const result = await response.json();
      
      toast({
        title: "Success",
        description: "Worker profile updated successfully",
      });

      if (onUpdate) {
        onUpdate({
          name: values.name,
          category: values.category,
          yearsOfExperience: values.yearsOfExperience,
          hourlyRate: values.hourlyRate,
          contactPhone: values.contactPhone,
          contactEmail: values.contactEmail,
          description: values.description,
          offersWarranty: values.offersWarranty,
          warrantyDetails: values.warrantyDetails,
        });
      }

      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error updating worker profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update worker profile",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoSection form={form} />
        <ExperienceSection form={form} />
        <ContactSection form={form} />
        <WarrantySection form={form} />
        <Button type="submit" className="w-full">
          {worker ? "Update Profile" : "Create Profile"}
        </Button>
      </form>
    </Form>
  );
};