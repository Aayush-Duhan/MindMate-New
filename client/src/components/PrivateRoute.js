import { Navigate } from 'react-router-dom';
import Layout from './layout/Layout';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return (
    <Layout user={user}>
      {children}
    </Layout>
  );
};

export default PrivateRoute; 