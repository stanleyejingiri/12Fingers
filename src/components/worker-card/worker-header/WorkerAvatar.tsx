import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkerAvatarProps {
  name: string;
  profileImageUrl: string;
}

export const WorkerAvatar = ({ name, profileImageUrl }: WorkerAvatarProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const placeholderImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
  
  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  
  return (
    <div className="relative">
      {isLoading && (
        <Skeleton className="h-12 w-12 rounded-full absolute top-0 left-0" />
      )}
      <Avatar className="h-12 w-12">
        <AvatarImage 
          src={hasError ? placeholderImage : profileImageUrl} 
          alt={name}
          loading="lazy"
          className="object-cover"
          onLoad={handleLoad}
          onError={handleError}
        />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
    </div>
  );
};