//src/components/worker-card/WorkerModals.tsx
/*import React from "react";
import { WorkerProfile } from "@/types/worker";
import { BookingModal } from "../BookingModal";
import { WorkerComments } from "../WorkerComments";
import { EditProfileModal } from "../worker-profile/EditProfileModal";
import { MessagingDialog } from "../messaging/MessagingDialog";

interface WorkerModalsProps {
  worker: WorkerProfile;
  showBookingModal: boolean;
  showComments: boolean;
  showEditModal: boolean;
  showMessaging: boolean;
  onCloseBooking: () => void;
  onCloseComments: () => void;
  onCloseEdit: () => void;
  onCloseMessaging: () => void;
  isOwner: boolean;
}

export const WorkerModals = ({
  worker,
  showBookingModal,
  showComments,
  showEditModal,
  showMessaging,
  onCloseBooking,
  onCloseComments,
  onCloseEdit,
  onCloseMessaging,
  isOwner,
}: WorkerModalsProps) => {
  return (
    <>
      <BookingModal
        worker={worker}
        isOpen={showBookingModal}
        onClose={onCloseBooking}
      />

      <WorkerComments
        workerId={worker.id}
        isOpen={showComments}
        onClose={onCloseComments}
      />

      {isOwner && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={onCloseEdit}
          worker={worker}
        />
      )}

      {worker.userId && (
        <MessagingDialog
          isOpen={showMessaging}
          onClose={onCloseMessaging}
          workerId={worker.id}
          workerUserId={worker.userId}
          workerName={worker.name}
        />
      )}
    </>
  );
};
*/

//src/components/worker-card/WorkerModals.tsx
/*import React from "react";
import { WorkerProfile } from "@/types/worker";
import { BookingModal } from "../BookingModal";
import { WorkerComments } from "../WorkerComments";
import { EditProfileModal } from "../worker-profile/EditProfileModal";
import { MessagingDialog } from "../messaging/MessagingDialog";

interface WorkerModalsProps {
  worker: WorkerProfile;
  showBookingModal: boolean;
  showComments: boolean;
  showEditModal: boolean;
  showMessaging: boolean;
  onCloseBooking: () => void;
  onCloseComments: () => void;
  onCloseEdit: () => void;
  onCloseMessaging: () => void;
  isOwner: boolean;
}

export const WorkerModals = ({
  worker,
  showBookingModal,
  showComments,
  showEditModal,
  showMessaging,
  onCloseBooking,
  onCloseComments,
  onCloseEdit,
  onCloseMessaging,
  isOwner,
}: WorkerModalsProps) => {
  return (
    <>
      <BookingModal
        worker={worker}
        isOpen={showBookingModal}
        onClose={onCloseBooking}
      />

      <WorkerComments
        workerId={worker.id}
        isOpen={showComments}
        onClose={onCloseComments}
      />

      {isOwner && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={onCloseEdit}
          worker={worker}
        />
      )}

      {// FIX: Remove the worker.userId check since it's undefined *}
      <MessagingDialog
        isOpen={showMessaging}
        onClose={onCloseMessaging}
        workerId={worker.id}
        workerUserId={worker.userId || worker.id} // Use worker.id as fallback
        workerName={worker.name}
      />
    </>
  );
};*/

//src/components/worker-card/WorkerModals.tsx
/*import React from "react";
import { WorkerProfile } from "@/types/worker";
import { BookingModal } from "../BookingModal";
import { WorkerComments } from "../WorkerComments";
import { EditProfileModal } from "../worker-profile/EditProfileModal";
import { MessagingDialog } from "../messaging/MessagingDialog";

interface WorkerModalsProps {
  worker: WorkerProfile;
  showBookingModal: boolean;
  showComments: boolean;
  showEditModal: boolean;
  showMessaging: boolean;
  onCloseBooking: () => void;
  onCloseComments: () => void;
  onCloseEdit: () => void;
  onCloseMessaging: () => void;
  isOwner: boolean;
}

export const WorkerModals = ({
  worker,
  showBookingModal,
  showComments,
  showEditModal,
  showMessaging,
  onCloseBooking,
  onCloseComments,
  onCloseEdit,
  onCloseMessaging,
  isOwner,
}: WorkerModalsProps) => {
  return (
    <>
      <BookingModal
        worker={worker}
        isOpen={showBookingModal}
        onClose={onCloseBooking}
      />

      <WorkerComments
        workerId={worker.id}
        isOpen={showComments}
        onClose={onCloseComments}
      />

      {isOwner && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={onCloseEdit}
          worker={worker}
        />
      )}*/

     
      /*<MessagingDialog
        isOpen={showMessaging}
        onClose={onCloseMessaging}
        workerId={worker.id}
        workerUserId={worker.id} 
        workerName={worker.name}
      />*/
	  
	/*{showMessaging && (
	  <Dialog open={true} onOpenChange={onCloseMessaging}>
		<DialogContent>
		  <DialogHeader>
			<DialogTitle>TEST Messaging Modal</DialogTitle>
		  </DialogHeader>
		  <div className="p-4">
			<p>If you can see this, the modal is working!</p>
			<Button onClick={onCloseMessaging}>Close Test</Button>
		  </div>
		</DialogContent>
	  </Dialog>
	)}
    </>
  );
};
*/

//src/components/worker-card/WorkerModals.tsx
/*import React from "react";
import { WorkerProfile } from "@/types/worker";
import { BookingModal } from "../BookingModal";
import { WorkerComments } from "../WorkerComments";
import { EditProfileModal } from "../worker-profile/EditProfileModal";
import { MessagingDialog } from "../messaging/MessagingDialog";
// ADD THESE IMPORTS:
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WorkerModalsProps {
  worker: WorkerProfile;
  showBookingModal: boolean;
  showComments: boolean;
  showEditModal: boolean;
  showMessaging: boolean;
  onCloseBooking: () => void;
  onCloseComments: () => void;
  onCloseEdit: () => void;
  onCloseMessaging: () => void;
  isOwner: boolean;
}

export const WorkerModals = ({
  worker,
  showBookingModal,
  showComments,
  showEditModal,
  showMessaging,
  onCloseBooking,
  onCloseComments,
  onCloseEdit,
  onCloseMessaging,
  isOwner,
}: WorkerModalsProps) => {
  return (
    <>
      <BookingModal
        worker={worker}
        isOpen={showBookingModal}
        onClose={onCloseBooking}
      />

      <WorkerComments
        workerId={worker.id}
        isOpen={showComments}
        onClose={onCloseComments}
      />

      {isOwner && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={onCloseEdit}
          worker={worker}
        />
      )}

      
      <MessagingDialog
        isOpen={showMessaging}
        onClose={onCloseMessaging}
        workerId={worker.id}
        workerUserId={worker.userId || worker.id}
        workerName={worker.name}
      />
    </>
  );
};
*/

//src/components/worker-card/WorkerModals.tsx
import React from "react";
import { WorkerProfile } from "@/types/worker";
import { BookingModal } from "../BookingModal";
import { WorkerComments } from "../WorkerComments";
import { EditProfileModal } from "../worker-profile/EditProfileModal";
import { MessagingDialog } from "../messaging/MessagingDialog";

interface WorkerModalsProps {
  worker: WorkerProfile;
  showBookingModal: boolean;
  showComments: boolean;
  showEditModal: boolean;
  showMessaging: boolean;
  onCloseBooking: () => void;
  onCloseComments: () => void;
  onCloseEdit: () => void;
  onCloseMessaging: () => void;
  isOwner: boolean;
}

export const WorkerModals = ({
  worker,
  showBookingModal,
  showComments,
  showEditModal,
  showMessaging,
  onCloseBooking,
  onCloseComments,
  onCloseEdit,
  onCloseMessaging,
  isOwner,
}: WorkerModalsProps) => {
  console.log('🔴 WorkerModals - showMessaging:', showMessaging);
  console.log('🔴 WorkerModals - worker.userId:', worker.userId);

  return (
    <>
      <BookingModal
        worker={worker}
        isOpen={showBookingModal}
        onClose={onCloseBooking}
      />

      <WorkerComments
        workerId={worker.id}
        isOpen={showComments}
        onClose={onCloseComments}
      />

      {isOwner && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={onCloseEdit}
          worker={worker}
        />
      )}

      {/* ALWAYS render MessagingDialog when showMessaging is true */}
      {showMessaging && (
		<MessagingDialog
		  isOpen={showMessaging}
		  onClose={onCloseMessaging}
		  workerId={worker.id}
		  workerUserId={worker.userId}   // ← only the user ID, no fallback
		  workerName={worker.name}
		/>
        /*<MessagingDialog
          isOpen={showMessaging}
          onClose={onCloseMessaging}
          workerId={worker.id}
          workerUserId={worker.userId || worker.id} // Fallback to worker.id
          workerName={worker.name}
        />*/
      )}
    </>
  );
};