import axios from '../utils/axios';

const TEMP_ADMIN = {
  id: 1,
  email: 'admin@example.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'Super Admin',
  permissions: [
    'View Users', 'Create Users', 'Update Users', 'Delete Users',
    'View Roles', 'Create Roles', 'Update Roles', 'Delete Roles',
    'View Permissions', 'Create Permissions', 'Update Permissions', 'Delete Permissions',
    'View Subscription Types', 'Create Subscription Types', 'Update Subscription Types', 'Delete Subscription Types',
    'View Billing', 'Create Billing', 'Update Billing', 'Delete Billing'
  ]
};

export const login = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === TEMP_ADMIN.email && password === TEMP_ADMIN.password) {
    const token = 'temp_jwt_token';
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(TEMP_ADMIN));
    return { user: TEMP_ADMIN, token };
  }
  throw new Error('Invalid credentials');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const hasPermission = (permission) => {
  const user = getCurrentUser();
  return user?.permissions?.includes(permission) || false;
}; 