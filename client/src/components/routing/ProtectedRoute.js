import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Get auth state from your auth context or state management
  const isAuthenticated = localStorage.getItem('token'); // or however you check auth
  const userRole = localStorage.getItem('userRole'); // or however you store role

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute; 