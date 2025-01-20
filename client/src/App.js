import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import PrivateRoute from './components/PrivateRoute';
import MoodTracker from './pages/MoodTracker';
import ChatBot from './components/ChatBot';
import AnonymousChatPage from './pages/AnonymousChatPage';
import CounselorChat from './components/chat/CounselorChat';
import { isValidToken } from './utils/auth';
import { useEffect } from 'react';
import StudentResources from './components/resources/StudentResources';
import ParentResources from './components/resources/ParentResources';
import ParentSupport from './components/support/ParentSupport';
import TeacherSupport from './components/support/TeacherSupport';
import UserManagement from './components/admin/UserManagement';
import SystemSettings from './components/admin/SystemSettings';
import Analytics from './components/admin/Analytics';
import StudentProgress from './pages/StudentProgress';
import { GoalProvider } from './context/GoalContext';
import { Toaster } from 'react-hot-toast';
import StudentProfile from './components/profile/StudentProfile';
import AdminProfile from './components/profile/AdminProfile';
import ParentProfile from './components/profile/ParentProfile';

function App() {
  useEffect(() => {
    isValidToken();
  }, []);

  return (
    <Router>
      <GoalProvider>
        <div className="min-h-screen bg-[#050505]">
          <Toaster
            position="center-center"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#1F2937',
                color: '#fff',
                border: '1px solid #374151',
                maxWidth: '500px',
                width: '90%'
              },
              className: 'rounded-xl'
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/resources" element={
              <PrivateRoute>
                <Resources />
              </PrivateRoute>
            } />
            <Route path="/mood" element={
              <PrivateRoute>
                <MoodTracker />
              </PrivateRoute>
            } />
            <Route path="/counselor/chats" element={
              <PrivateRoute allowedRoles={['counselor']}>
                <CounselorChat />
              </PrivateRoute>
            } />
            <Route path="/student/chat" element={
              <PrivateRoute>
                <AnonymousChatPage />
              </PrivateRoute>
            } />
            <Route path="/student/resources" element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentResources />
              </PrivateRoute>
            } />
            <Route path="/student/progress" element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentProgress />
              </PrivateRoute>
            } />
            <Route path="/student/profile" element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentProfile />
              </PrivateRoute>
            } />
            <Route path="/parent/resources" element={
              <PrivateRoute allowedRoles={['parent']}>
                <ParentResources />
              </PrivateRoute>
            } />
            <Route path="/parent/support" element={
              <PrivateRoute allowedRoles={['parent']}>
                <ParentSupport />
              </PrivateRoute>
            } />
            <Route path="/parent/profile" element={
              <PrivateRoute allowedRoles={['parent']}>
                <ParentProfile />
              </PrivateRoute>
            } />
            <Route path="/teacher/support" element={
              <PrivateRoute allowedRoles={['teacher']}>
                <TeacherSupport />
              </PrivateRoute>
            } />
            <Route path="/admin/users" element={
              <PrivateRoute allowedRoles={['admin']}>
                <UserManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/settings" element={
              <PrivateRoute allowedRoles={['admin']}>
                <SystemSettings />
              </PrivateRoute>
            } />
            <Route path="/admin/analytics" element={
              <PrivateRoute allowedRoles={['admin']}>
                <Analytics />
              </PrivateRoute>
            } />
            <Route path="/admin/profile" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminProfile />
              </PrivateRoute>
            } />
          </Routes>
          <ChatBot />
        </div>
      </GoalProvider>
    </Router>
  );
}

export default App;
