export const refreshToken = async () => {
  try {
    const oldToken = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: oldToken })
    });

    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      return data.token;
    }
    
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export const handleTokenExpiration = async (error) => {
  if (error.message.includes('jwt expired')) {
    const newToken = await refreshToken();
    if (newToken) {
      return newToken;
    }
    // If refresh fails, redirect to login
    window.location.href = '/login';
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
  window.location.href = '/login';
};

export const isValidToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    // Get the expiry from the token (assuming it's a JWT)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    const { exp } = JSON.parse(jsonPayload);

    // Check if token is expired
    if (exp * 1000 < Date.now()) {
      logout();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    logout();
    return false;
  }
}; 