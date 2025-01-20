import ParentProfile from '../components/profile/ParentProfile';
import ParentDashboard from '../components/parent/ParentDashboard';

const parentRoutes = [
  {
    path: '/parent',
    element: <ParentDashboard />
  },
  {
    path: '/parent/profile',
    element: <ParentProfile />
  }
];

export default parentRoutes;
