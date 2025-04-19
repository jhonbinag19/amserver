const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Database connection function
const connectDB = async () => {
  try {
    // Test the connection
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) throw error;
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Export the Supabase client and connection function
module.exports = {
  supabase,
  connectDB
}; 