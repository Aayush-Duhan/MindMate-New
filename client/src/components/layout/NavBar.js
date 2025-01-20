import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const NavBar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState(3);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // For debugging
  useEffect(() => {
    console.log('Current user:', user);
    console.log('Current role:', user?.role);
  }, [user]);

  // Navigation items based on user role
  const getNavItems = () => {
    if (!user || !user.role) {
      console.warn('No user role found');
      return [];
    }

    switch (user.role.toLowerCase()) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/', icon: HomeIcon },
          { name: 'Users', path: '/admin/users', icon: UserGroupIcon },
          { name: 'Analytics', path: '/admin/analytics', icon: ChartBarIcon },
          { name: 'Settings', path: '/admin/settings', icon: Cog6ToothIcon },
        ];
      case 'counselor':
        return [
          { name: 'Dashboard', path: '/', icon: HomeIcon },
          { name: 'Chats', path: '/counselor/chats', icon: ChatBubbleLeftRightIcon },
          { name: 'Sessions', path: '/counselor/sessions', icon: CalendarDaysIcon },
          { name: 'Students', path: '/counselor/students', icon: UserGroupIcon },
          { name: 'Analytics', path: '/counselor/analytics', icon: ChartBarIcon },
        ];
      case 'teacher':
        return [
          { name: 'Dashboard', path: '/', icon: HomeIcon },
          { name: 'Students', path: '/teacher/students', icon: UserGroupIcon },
          { name: 'Support', path: '/teacher/support', icon: ChatBubbleLeftRightIcon },
          { name: 'Reports', path: '/teacher/reports', icon: ChartBarIcon },
        ];
      case 'parent':
        return [
          { name: 'Dashboard', path: '/', icon: HomeIcon },
          { name: 'Child Progress', path: '/parent/progress', icon: ChartBarIcon },
          { name: 'Support', path: '/parent/support', icon: ChatBubbleLeftRightIcon },
          { name: 'Resources', path: '/parent/resources', icon: CalendarDaysIcon },
        ];
      case 'student':
        return [
          { name: 'Dashboard', path: '/', icon: HomeIcon },
          { name: 'Chat', path: '/student/chat', icon: ChatBubbleLeftRightIcon },
          { name: 'Resources', path: '/student/resources', icon: CalendarDaysIcon },
          { name: 'Progress', path: '/student/progress', icon: ChartBarIcon },
        ];
      default:
        console.warn('Unknown role:', user.role);
        return [];
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Sidebar - Hidden on Mobile */}
      <nav className="hidden md:flex fixed top-0 left-0 h-screen w-sidebar bg-[#111111] border-r border-gray-800 p-4 flex-col justify-between">
        {/* Logo and Brand */}
        <div>
          <Link to="/" className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">🧠</span>
            </div>
            <span className="text-xl font-bold text-white">MindMate</span>
          </Link>

          {/* Navigation Items */}
          <div className="space-y-2">
            {getNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all
                  ${location.pathname === item.path
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-2">
          {/* Notifications */}
          <button className="w-full flex items-center justify-between px-4 py-2.5 text-gray-400 hover:bg-[#1a1a1a] hover:text-white rounded-lg transition-all">
            <div className="flex items-center space-x-3">
              <BellIcon className="w-5 h-5" />
              <span>Notifications</span>
            </div>
            {notifications > 0 && (
              <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-xs">
                {notifications}
              </span>
            )}
          </button>

          {/* Profile */}
          <Link
            to={user?.role === 'student' ? '/student/profile' : `/${user?.role}/profile`}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-400 hover:bg-[#1a1a1a] hover:text-white rounded-lg transition-all"
          >
            <UserCircleIcon className="w-5 h-5" />
            <span>Profile</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-all"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Top Bar */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-[#111111] border-b border-gray-800 px-4 flex items-center justify-between z-40">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">🧠</span>
            </div>
            <span className="text-lg font-bold text-white">MindMate</span>
          </Link>

          {/* Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-[#111111] pt-16 z-30">
            <div className="p-4 space-y-4">
              {/* Navigation Items */}
              {getNavItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                    ${location.pathname === item.path
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                    }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-lg">{item.name}</span>
                </Link>
              ))}

              {/* Notifications */}
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-4 py-3 text-gray-400 hover:bg-[#1a1a1a] hover:text-white rounded-lg transition-all"
              >
                <div className="flex items-center space-x-3">
                  <BellIcon className="w-6 h-6" />
                  <span className="text-lg">Notifications</span>
                </div>
                {notifications > 0 && (
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-xs">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Profile */}
              <Link
                to={user?.role === 'student' ? '/student/profile' : `/${user?.role}/profile`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-[#1a1a1a] hover:text-white rounded-lg transition-all"
              >
                <UserCircleIcon className="w-6 h-6" />
                <span className="text-lg">Profile</span>
              </Link>

              {/* Logout */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-all"
              >
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                <span className="text-lg">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NavBar;