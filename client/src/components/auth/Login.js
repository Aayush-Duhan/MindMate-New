const handleLogin = async (credentials) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.token);
      // Store user data including role
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name
      }));

      // Redirect based on role
      switch (data.user.role.toLowerCase()) {
        case 'admin':
          navigate('/admin');
          break;
        case 'counselor':
          navigate('/counselor');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'parent':
          navigate('/parent');
          break;
        default:
          navigate('/student');
      }
    } else {
      setError(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    setError('Failed to login. Please try again.');
  }
}; 