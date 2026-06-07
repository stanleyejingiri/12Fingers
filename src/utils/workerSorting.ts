import { WorkerProfile } from "@/types/worker";
import { distance } from "@turf/turf";

export const sortWorkers = (
  workers: WorkerProfile[],
  sortBy: string,
  userLocation: [number, number] | null
): WorkerProfile[] => {
  return [...workers].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.averageRating || 0) - (a.averageRating || 0);
      case "rating_asc":
        return (a.averageRating || 0) - (b.averageRating || 0);
      case "price":
        return (a.hourlyRate || 0) - (b.hourlyRate || 0);
      case "price_desc":
        return (b.hourlyRate || 0) - (a.hourlyRate || 0);
      case "experience":
        return (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0);
      case "experience_asc":
        return (a.yearsOfExperience || 0) - (b.yearsOfExperience || 0);
      case "distance":
        if (!userLocation || !a.location || !b.location) return 0;
        const distanceA = distance(
          [a.location.longitude, a.location.latitude],
          userLocation
        );
        const distanceB = distance(
          [b.location.longitude, b.location.latitude],
          userLocation
        );
        return distanceA - distanceB;
      case "distance_desc":
        if (!userLocation || !a.location || !b.location) return 0;
        const distanceC = distance(
          [a.location.longitude, a.location.latitude],
          userLocation
        );
        const distanceD = distance(
          [b.location.longitude, b.location.latitude],
          userLocation
        );
        return distanceD - distanceC;
      default:
        return 0;
    }
  });
};