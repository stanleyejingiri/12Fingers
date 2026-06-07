import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface BookingModalHeaderProps {
  workerName: string;
}

export const BookingModalHeader = ({ workerName }: BookingModalHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle>Book {workerName}</DialogTitle>
      <DialogDescription>
        Choose a service package or create a custom booking
      </DialogDescription>
    </DialogHeader>
  );
};
