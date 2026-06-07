//src/components/worker-profile//WorkerHeader.tsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { WorkerProfile } from "@/types/worker";

interface WorkerHeaderProps {
  worker: {
    // Combined type for both database (snake_case) and UI (camelCase) fields
    id: string;
    name: string;
    category: string;
    profile_image_url?: string;  // From database
    profileImageUrl?: string;   // From UI (fallback)
    is_verified?: boolean;      // From database
    isVerified?: boolean;       // From UI
    is_premium?: boolean;       // From database
    isPremium?: boolean;        // From UI
    average_rating?: number;    // From database
    averageRating?: number;     // From UI
    total_ratings?: number;     // From database
    totalRatings?: number;      // From UI
  };
}

export const WorkerHeader = ({ worker }: WorkerHeaderProps) => {
  // Normalize worker data (handle both snake_case and camelCase)
  const normalizedWorker = {
    name: worker.name,
    category: worker.category,
    profileImageUrl: worker.profile_image_url || worker.profileImageUrl,
    isVerified: worker.is_verified || worker.isVerified,
    isPremium: worker.is_premium || worker.isPremium,
    averageRating: worker.average_rating || worker.averageRating || 0,
    totalRatings: worker.total_ratings || worker.totalRatings || 0
  };

  return (
    <div className="flex flex-row items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage 
          src={normalizedWorker.profileImageUrl} 
          alt={normalizedWorker.name} 
        />
        <AvatarFallback>
          {normalizedWorker.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
		// Inside the `div` that contains the name and other badges
		<div className="flex items-center gap-2 flex-wrap">
		  <h1 className="text-2xl font-bold">{normalizedWorker.name}</h1>
		  {!normalizedWorker.isVerified && (
			<Badge variant="outline" className="bg-yellow-100 text-yellow-800">
			  Pending Verification
			</Badge>
		  )}
		  {normalizedWorker.isVerified && (
			<Badge variant="secondary" className="bg-green-100 text-green-800">
			  Verified
			</Badge>
		  )}
		  {normalizedWorker.isPremium && (
			<Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
			  Premium
			</Badge>
		  )}
		</div>
	  
	  	/*
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{normalizedWorker.name}</h1>
          {normalizedWorker.isVerified && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Verified
            </Badge>
          )}
          {normalizedWorker.isPremium && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Premium
            </Badge>
          )}
        </div>
		*/
		
        <p className="text-muted-foreground capitalize">
          {normalizedWorker.category.toLowerCase()}
        </p>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">
            {normalizedWorker.averageRating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            ({normalizedWorker.totalRatings} reviews)
          </span>
        </div>
      </div>
    </div>
  );
};







/*
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { WorkerProfile } from "@/types/worker";

interface WorkerHeaderProps {
  worker: WorkerProfile;
}

export const WorkerHeader = ({ worker }: WorkerHeaderProps) => {
  return (
    <div className="flex flex-row items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={worker.profileImageUrl} alt={worker.name} />
        <AvatarFallback>{worker.name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{worker.name}</h1>
          {worker.isVerified && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Verified
            </Badge>
          )}
          {worker.isPremium && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Premium
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">{worker.category}</p>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{worker.averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground">({worker.totalRatings} reviews)</span>
        </div>
      </div>
    </div>
  );
};*/






