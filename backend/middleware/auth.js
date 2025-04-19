const { supabase } = require('../database');

const authenticateUser = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return res.status(401).json({ error: 'User profile not found' });
    }

    // Attach user to request object
    req.user = {
      ...user,
      ...profile,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

const authenticateAdmin = async (req, res, next) => {
  try {
    // First authenticate the user
    await authenticateUser(req, res, (err) => {
      if (err) return next(err);
      
      // Check if user is admin
      if (!req.user.is_admin) {
        return res.status(403).json({ error: 'Admin access required' });
      }
      
      next();
    });
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ error: 'Admin authentication failed' });
  }
};

module.exports = {
  authenticateUser,
  authenticateAdmin
}; 