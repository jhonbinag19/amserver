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

const App = () => {
  return (
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
            path="/*"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            
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
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App; 