/*import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/types/booking";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export const BookingStatusBadge = ({ status }: BookingStatusBadgeProps) => {
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} font-medium`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};*/

// src/components/booking/BookingStatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/types/booking";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export const BookingStatusBadge = ({ status }: BookingStatusBadgeProps) => {
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'offer_pending':
        return 'bg-amber-100 text-amber-800';
      case 'offer_accepted':
        return 'bg-blue-100 text-blue-800';
      case 'payment_pending':
        return 'bg-purple-100 text-purple-800';
	  case 'awaiting_confirmation':
		return <Badge className="bg-yellow-500">Awaiting Confirmation</Badge>;
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-indigo-100 text-indigo-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Convert status to display text
  const getDisplayText = (status: BookingStatus) => {
    const textMap: Record<BookingStatus, string> = {
      'pending': 'Pending',
      'offer_pending': 'Offer Pending',
      'offer_accepted': 'Offer Accepted',
      'payment_pending': 'Payment Pending',
      'confirmed': 'Confirmed',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'rejected': 'Rejected',
      'cancelled': 'Cancelled'
    };
    
    return textMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Badge className={`${getStatusColor(status)} font-medium`}>
      {getDisplayText(status)}
    </Badge>
  );
};