import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export default function ProtectedRoute() {
	const [user, loading] = useAuthState(auth);

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-lg'>Loading...</div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to='/login' replace />;
	}

	return <Outlet />;
}
