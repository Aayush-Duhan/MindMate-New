import AdminProfile from '../components/admin/AdminProfile';
import AdminDashboard from '../components/admin/AdminDashboard';
import SystemSettings from '../components/admin/SystemSettings';
import Analytics from '../components/admin/Analytics';

const adminRoutes = [
  {
    path: '/admin',
    element: <AdminDashboard />
  },
  {
    path: '/admin/profile',
    element: <AdminProfile />
  },
  {
    path: '/admin/settings',
    element: <SystemSettings />
  },
  {
    path: '/admin/analytics',
    element: <Analytics />
  }
];

export default adminRoutes;