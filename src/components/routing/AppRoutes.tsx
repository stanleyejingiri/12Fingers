// src/components/routing/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import UserDashboard from "@/pages/UserDashboard";
import WorkerDashboard from "@/pages/WorkerDashboard";
import WorkerProfile from "@/pages/WorkerProfile";
import WorkerRegistration from "@/pages/WorkerRegistration";
import BookingSuccess from "@/pages/BookingSuccess"; 
import PaymentSuccess from "@/pages/PaymentSuccess"; // 🔴 ADD THIS IMPORT
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/hooks/useAuth";
import DashboardRouter from "@/pages/DashboardRouter"; 
import AdminDashboard from "@/pages/AdminDashboard";
import WorkerVerification from "@/pages/WorkerVerification";


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
		<Route path="/" element={<Index />} />
      
		<Route 
			path="/dashboard" 
			element={
		  <ProtectedRoute>
			<DashboardRouter />
		  </ProtectedRoute>
		  /*<ProtectedRoute>
			  {user?.id === 'c8008077-f7ab-11f0-b194-8d6e8344ca2c' ? (
				<Navigate to="/admin" />
			  ) : (
				<DashboardRouter />
			  )}
		  </ProtectedRoute>*/
			} 
		/>
      
		  <Route 
			path="/user-dashboard" 
			element={
			  <ProtectedRoute>
				<UserDashboard />
			  </ProtectedRoute>
			} 
		  />
      
		<Route 
			path="/worker-dashboard" 
			element={
			  <ProtectedRoute>
				<WorkerDashboard />
			  </ProtectedRoute>
			} 
		  />
      
		<Route path="/worker/:id" element={<WorkerProfile />} />
		<Route path="/worker-registration" element={<WorkerRegistration />} />
		<Route path="/booking-success" element={<BookingSuccess />} />
      
		{/* 🔴 ADD THIS LINE - Payment success page (no auth required, comes from Stripe redirect) */}
		<Route path="/payment-success" element={<PaymentSuccess />} />
      
		<Route path="*" element={<NotFound />} />
	  
		// Add this route
		<Route 
		  path="/admin" 
		  element={
			<ProtectedRoute>
			  <AdminDashboard />
			</ProtectedRoute>
		  } 
		/>
		
		// Then add route
		<Route path="/worker-verification" element={
		  <ProtectedRoute>
			<WorkerVerification />
		  </ProtectedRoute>
		} />
		
	</Routes>
  );
}
