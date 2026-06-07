//src/components/WorkerCard.tsx
import { useState } from "react";
import { CardHeader, CardFooter } from "@/components/ui/card";
import { WorkerProfile } from "@/types/worker";
import { WorkerHeader } from "./worker-card/WorkerHeader";
import { WorkerBookingActions } from "./worker-card/WorkerBookingActions";
import { WorkerModals } from "./worker-card/WorkerModals";
import { WorkerCardContainer } from "./worker-card/WorkerCardContainer";
import { WorkerCardContent } from "./worker-card/WorkerCardContent";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface WorkerCardProps {
  worker: WorkerProfile;
  distance?: number | null;
  isFavorite?: boolean;
  onToggleFavorite?: (workerId: string) => void;
}

export const WorkerCard = ({ 
  worker, 
  distance,
  isFavorite = false,
  onToggleFavorite
}: WorkerCardProps) => {
	console.log('📦 WorkerCard MOUNTED:', {
    worker: worker.name,
    hasOnToggleFavoriteProp: !!onToggleFavorite,
    isFavoriteProp: isFavorite
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const isOwner = user?.id === worker.userId;


  // In WorkerCard.tsx - update the handleMessageClick function:
	const handleMessageClick = () => {
	  console.log('🔴 Message button clicked in WorkerCard');
	  console.log('🔴 User:', user?.id);
	  console.log('🔴 Worker userId:', worker.userId);
	  
	  if (!user) {
		console.log('❌ No user - showing toast');
		toast({
		  title: "Sign in required",
		  description: "Please sign in to send messages to workers.",
		  variant: "destructive"
		});
		return;
	  }
	  
	  console.log('✅ User exists - setting showMessaging to true');
	  setShowMessaging(true);
	};

  
  	// In WorkerCard.tsx, update the handleFavoriteClick function:
	const handleFavoriteClick = () => {
	  console.log('🎯 handleFavoriteClick FIRED in WorkerCard!', {
		workerId: worker.id,
		workerName: worker.name,
		hasOnToggleFavorite: !!onToggleFavorite,
		user: user?.id
	  });
	  
	  if (!user) {
		toast({
		  title: "Sign in required",
		  description: "Please sign in to add workers to favorites.",
		  variant: "destructive"
		});
		return;
	  }
	  
	  if (onToggleFavorite) {
		console.log('🎯 Calling onToggleFavorite with worker.id:', worker.id);
		onToggleFavorite(worker.id);
	  } else {
		console.log('❌ onToggleFavorite is undefined!');
	  }
	};


  const handleBookingClick = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book services.",
        variant: "destructive"
      });
      return;
    }
    setShowBookingModal(true);
  };

  return (
    <>
      <WorkerCardContainer
        worker={worker}
        isFavorite={isFavorite}
        onFavoriteToggle={handleFavoriteClick}
      >
        <CardHeader>
          <WorkerHeader 
            worker={worker} 
            onEditClick={isOwner ? () => setShowEditModal(true) : undefined}
          />
        </CardHeader>

        <WorkerCardContent
          worker={worker}
          distance={distance}
          onMessageClick={handleMessageClick}
        />

        <CardFooter>
          <WorkerBookingActions
            onBookClick={handleBookingClick}
            onCommentsClick={() => setShowComments(true)}
          />
        </CardFooter>
      </WorkerCardContainer>

      <WorkerModals
        worker={worker}
        showBookingModal={showBookingModal}
        showComments={showComments}
        showEditModal={showEditModal}
        showMessaging={showMessaging}
        onCloseBooking={() => setShowBookingModal(false)}
        onCloseComments={() => setShowComments(false)}
        onCloseEdit={() => setShowEditModal(false)}
        onCloseMessaging={() => setShowMessaging(false)}
        isOwner={isOwner}
      />
    </>
  );
};