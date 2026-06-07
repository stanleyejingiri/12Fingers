// src/pages/DashboardRouter.tsx
/*
import { useAuth } from "@/hooks/useAuth";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import UserDashboard from "./UserDashboard";
import WorkerDashboard from "./WorkerDashboard";
import { Navigate } from "react-router-dom";

export default function DashboardRouter() {
  const { user } = useAuth();
  const { worker, isLoading } = useWorkerProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If user has a worker profile, show Worker Dashboard
  const { user } = useAuth();

   if (user?.id === 'c8008077-f7ab-11f0-b194-8d6e8344ca2c') {
	  return <Navigate to="/admin" />;
	}
  if (worker) {
    return <WorkerDashboard />;
  }

  // Otherwise show User Dashboard
  return <UserDashboard />;
}*/

// src/pages/DashboardRouter.tsx
/*
import { useAuth } from "@/hooks/useAuth";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import UserDashboard from "./UserDashboard";
import WorkerDashboard from "./WorkerDashboard";
import { Navigate } from "react-router-dom";

export default function DashboardRouter() {
  const { user } = useAuth();  // ✅ Only once
  const { worker, isLoading } = useWorkerProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Admin redirect
  if (user?.id === 'c8008077-f7ab-11f0-b194-8d6e8344ca2c') {
    return <Navigate to="/admin" />;
  }

  // Worker dashboard
  if (worker) {
    return <WorkerDashboard />;
  }

  // Default user dashboard
  return <UserDashboard />;
}
*/
// src/pages/DashboardRouter.tsx
import { useAuth } from "@/hooks/useAuth";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import UserDashboard from "./UserDashboard";
import WorkerDashboard from "./WorkerDashboard";
import { Navigate } from "react-router-dom";

export default function DashboardRouter() {
	const { user } = useAuth();
	console.log('🔍 DashboardRouter - user:', user);
	console.log('🔍 DashboardRouter - user.id:', user?.id);
	const { worker, isLoading } = useWorkerProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If user is admin, redirect to admin panel
  if (user?.id === 'c8008077-f7ab-11f0-b194-8d6e8344ca2c') {
    return <Navigate to="/admin" />;
  }

  // If user has a worker profile, show WorkerDashboard
  if (worker) {
    return <WorkerDashboard />;
  }

  // Otherwise, show regular UserDashboard
  return <UserDashboard />;
}
