//src/components/worker-profile/EditProfileModal.tsx
/*
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkerProfile } from "@/types/worker";
import { WorkerProfileForm } from "./WorkerProfileForm";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker?: WorkerProfile;
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  worker,
}: EditProfileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {worker ? "Edit Profile" : "Create Worker Profile"}
          </DialogTitle>
        </DialogHeader>
        <WorkerProfileForm
          worker={worker}
          onSuccess={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
*/
// src/components/worker-profile/EditProfileModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkerProfile } from "@/types/worker";
import { WorkerProfileForm } from "./WorkerProfileForm";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker?: WorkerProfile;
  onUpdate?: (updatedData: Partial<WorkerProfile>) => void;  // ← ADD THIS
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  worker,
  onUpdate,  // ← ADD THIS
}: EditProfileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {worker ? "Edit Profile" : "Create Worker Profile"}
          </DialogTitle>
        </DialogHeader>
        <WorkerProfileForm
          worker={worker}
          onSuccess={onClose}
          onUpdate={onUpdate}  // ← ADD THIS
        />
      </DialogContent>
    </Dialog>
  );
};
