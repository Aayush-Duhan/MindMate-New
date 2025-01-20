import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import CounselorDashboard from '../components/dashboards/CounselorDashboard';
import TeacherDashboard from '../components/dashboards/TeacherDashboard';
import ParentDashboard from '../components/dashboards/ParentDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard user={user} />;
      case 'counselor':
        return <CounselorDashboard user={user} />;
      case 'teacher':
        return <TeacherDashboard user={user} />;
      case 'parent':
        return <ParentDashboard user={user} />;
      case 'admin':
        return <AdminDashboard user={user} />;
      default:
        return (
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600">Invalid Role</h1>
            <p className="mt-2 text-gray-600">Please contact support for assistance.</p>
          </div>
        );
    }
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard; 