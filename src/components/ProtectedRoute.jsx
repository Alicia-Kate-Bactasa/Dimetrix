import { Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Authentication disabled for frontend development - allow direct access
  return <Outlet />;
}
