const { supabase } = require('../config/supabase');

const DEMO_USER = {
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

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async signup(req, res) {
    try {
      const { email, password } = req.body;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async logout(req, res) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async getCurrentUser(req, res) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      res.json({ user });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error) throw error;

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      res.json({
        user: {
          ...user,
          ...profile,
        }
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: error.message });
    }
  }
};

module.exports = authController; 