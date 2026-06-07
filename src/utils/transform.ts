// utils/transform.ts
export const mapWorkerToUI = (worker: WorkerProfile) => ({
  ...worker,
  // Map snake_case to camelCase for components
  userId: worker.user_id,
  yearsOfExperience: worker.years_of_experience,
  hourlyRate: worker.hourly_rate,
  isVerified: worker.is_verified,
});