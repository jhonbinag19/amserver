import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/user/settings/Settings';
import Schema from './pages/admin/schema';
import ApiConnection from './components/ghl/ApiConnection';
import AgencyAccounts from './components/ghl/AgencyAccounts';
import DashboardLayout from './components/userLayout/DashboardLayout';
import { isAuthenticated } from './services/auth';
import IntegrationTools from './pages/user/IntegrationTools';
import WorkflowActions from './components/workflow/WorkflowActions';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/layout/Sidebar';

const PrivateRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setIsAuth(auth);
    };
    checkAuth();
  }, []);

  if (isAuth === null) {
    return null; // or a loading spinner
  }

  return isAuth ? children : <Navigate to="/login" />;
};

// Protected Route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

const App = () => {
  return (
    <AuthProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
          },
        }}
      >
        <Router basename="/">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <div className="flex h-screen">
                    <Sidebar />
                    <Dashboard />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            
            {/* User Routes */}
            <Route path="users">
              <Route path="settings" element={<Settings />} />
              <Route path="integrations">
                <Route path="connection" element={<ApiConnection />} />
                <Route path="agency" element={<AgencyAccounts />} />
                <Route path="tools" element={<IntegrationTools />} />
              </Route>
            </Route>
            
            {/* Admin Routes */}
            <Route path="schema" element={<Schema />} />
            <Route path="workflows" element={<WorkflowActions />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </AuthProvider>
  );
};

export default App; 