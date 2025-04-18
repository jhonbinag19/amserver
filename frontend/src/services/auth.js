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
      password
    });

    if (error) throw error;

    return {
      user: data.user,
      token: data.session.access_token
    };
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    throw new Error(error.message || 'Logout failed');
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch (error) {
    return false;
  }
};

export const hasPermission = async (permission) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Get user permissions from Supabase
    const { data: permissions, error } = await supabase
      .from('user_permissions')
      .select('permission')
      .eq('user_id', user.id);

    if (error) throw error;

    return permissions.some(p => p.permission === permission);
  } catch (error) {
    return false;
  }
}; 