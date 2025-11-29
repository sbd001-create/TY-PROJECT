// Helper function to get admin authorization header
export const getAdminAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return {};
  }
  return {
    'Authorization': `Bearer ${token}`
  };
};

// Helper function to check if admin is authenticated
export const isAdminAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

// Helper function to get current admin username
export const getCurrentAdminUsername = () => {
  return localStorage.getItem('adminUsername');
};

// Helper function to logout admin
export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUsername');
};

// Get current admin role
export const getCurrentAdminRole = () => {
  return localStorage.getItem('adminRole');
};

// Extended logout to clear role as well
export const clearAdminSession = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUsername');
  localStorage.removeItem('adminRole');
};
