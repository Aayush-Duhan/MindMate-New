import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' // Default role
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#111111] rounded-lg shadow-xl border border-gray-900">
        <h2 className="text-3xl font-bold text-center text-white">Create an Account</h2>
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md bg-[#0a0a0a] border-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-md bg-[#0a0a0a] border-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full rounded-md bg-[#0a0a0a] border-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="" className="bg-[#0a0a0a]">Select a role</option>
              <option value="student" className="bg-[#0a0a0a]">Student</option>
              <option value="teacher" className="bg-[#0a0a0a]">Teacher</option>
              <option value="counselor" className="bg-[#0a0a0a]">Counselor</option>
              <option value="parent" className="bg-[#0a0a0a]">Parent</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 