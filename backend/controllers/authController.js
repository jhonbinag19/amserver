const jwt = require('jsonwebtoken');

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

      if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: DEMO_USER.id,
          email: DEMO_USER.email,
          role: DEMO_USER.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: DEMO_USER.id,
          name: DEMO_USER.name,
          email: DEMO_USER.email,
          role: DEMO_USER.role,
          permissions: DEMO_USER.permissions
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      res.json({
        user: {
          id: DEMO_USER.id,
          name: DEMO_USER.name,
          email: DEMO_USER.email,
          role: DEMO_USER.role,
          permissions: DEMO_USER.permissions
        }
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  }
};

module.exports = authController; 