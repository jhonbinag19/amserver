const { supabase } = require('../database');

const profileController = {
  // Get user profile
  async getProfile(req, res) {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select(`
          *,
          organizations:organization_id (
            id,
            name,
            settings
          )
        `)
        .eq('id', req.user.id)
        .single();

      if (error) throw error;
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      res.json(profile);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { name, email, phone, avatar_url, settings } = req.body;

      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (checkError) throw checkError;
      if (!existingProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      // Update profile
      const { data: updatedProfile, error: updateError } = await supabase
        .from('users')
        .update({
          name: name || existingProfile.name,
          email: email || existingProfile.email,
          phone: phone || existingProfile.phone,
          avatar_url: avatar_url || existingProfile.avatar_url,
          settings: settings || existingProfile.settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.user.id)
        .select(`
          *,
          organizations:organization_id (
            id,
            name,
            settings
          )
        `)
        .single();

      if (updateError) throw updateError;

      res.json({
        message: 'Profile updated successfully',
        profile: updatedProfile
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update user password
  async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      // Verify current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: req.user.email,
        password: currentPassword
      });

      if (verifyError) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Update password error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update user avatar
  async updateAvatar(req, res) {
    try {
      const { avatar_url } = req.body;

      // Update avatar
      const { data: updatedProfile, error } = await supabase
        .from('users')
        .update({
          avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.user.id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        message: 'Avatar updated successfully',
        profile: updatedProfile
      });
    } catch (error) {
      console.error('Update avatar error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get user preferences
  async getPreferences(req, res) {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('settings')
        .eq('id', req.user.id)
        .single();

      if (error) throw error;
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      res.json(profile.settings || {});
    } catch (error) {
      console.error('Get preferences error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update user preferences
  async updatePreferences(req, res) {
    try {
      const { settings } = req.body;

      // Update preferences
      const { data: updatedProfile, error } = await supabase
        .from('users')
        .update({
          settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.user.id)
        .select('settings')
        .single();

      if (error) throw error;

      res.json({
        message: 'Preferences updated successfully',
        settings: updatedProfile.settings
      });
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get user's organization memberships
  async getOrganizationMemberships(req, res) {
    try {
      const { data: memberships, error } = await supabase
        .from('organization_members')
        .select(`
          *,
          organizations:organization_id (
            id,
            name,
            settings
          )
        `)
        .eq('user_id', req.user.id);

      if (error) throw error;

      res.json(memberships);
    } catch (error) {
      console.error('Get memberships error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update user's organization settings
  async updateOrganizationSettings(req, res) {
    try {
      const { organizationId } = req.params;
      const { settings } = req.body;

      // Check if user is a member of the organization
      const { data: membership, error: checkError } = await supabase
        .from('organization_members')
        .select('*')
        .eq('user_id', req.user.id)
        .eq('organization_id', organizationId)
        .single();

      if (checkError) throw checkError;
      if (!membership) {
        return res.status(403).json({ message: 'Not a member of this organization' });
      }

      // Update organization settings
      const { data: updatedOrganization, error: updateError } = await supabase
        .from('organizations')
        .update({
          settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId)
        .select()
        .single();

      if (updateError) throw updateError;

      res.json({
        message: 'Organization settings updated successfully',
        organization: updatedOrganization
      });
    } catch (error) {
      console.error('Update organization settings error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = profileController; 