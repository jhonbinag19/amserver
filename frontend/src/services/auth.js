import { supabase } from '../config/supabase';

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
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Signout error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

export const isAuthenticated = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

export const hasPermission = (permission) => {
  const user = getCurrentUser();
  return user?.permissions?.includes(permission) || false;
}; 