import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user._id);
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#111111] rounded-lg shadow-xl border border-gray-900">
        <h2 className="text-3xl font-bold text-center text-white">Sign in to MindMate</h2>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md bg-[#0a0a0a] border-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 rounded-md shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Sign in
          </button>
          <div className="text-center mt-4">
            <Link
              to="/register"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 