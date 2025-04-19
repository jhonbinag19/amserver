import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Settings from './pages/Settings';
import Workflows from './pages/Workflows';
import ApiConnection from './components/ghl/ApiConnection';
import AgencyAccounts from './components/ghl/AgencyAccounts';
import SubAccounts from './components/ghl/SubAccounts';
import IntegrationWorkflows from './components/ghl/IntegrationWorkflows';
import PaymentBilling from './components/ghl/PaymentBilling';
import IntegrationSettings from './components/ghl/IntegrationSettings';
import WorkflowCanvas from './components/zapier-workflow/WorkflowCanvas';
import WorkflowStep from './components/zapier-workflow/WorkflowStep';
import WorkflowManager from './components/zapier-workflow/WorkflowManager';
import DashboardLayout from './components/layout/DashboardLayout';
import { isAuthenticated } from './services/auth';

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
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="workflows" element={<Workflows />} />
            <Route path="settings" element={<Settings />} />
            
            {/* GHL Integration Routes */}
            <Route path="ghl/connection" element={<ApiConnection />} />
            <Route path="ghl/agency" element={<AgencyAccounts />} />
            <Route path="ghl/sub-accounts" element={<SubAccounts />} />
            <Route path="ghl/workflows" element={<IntegrationWorkflows />} />
            <Route path="ghl/billing" element={<PaymentBilling />} />
            <Route path="ghl/settings" element={<IntegrationSettings />} />

            {/* Zapier Workflow Routes */}
            <Route path="zapier-workflow/canvas" element={<WorkflowCanvas />} />
            <Route path="zapier-workflow/steps" element={<WorkflowStep />} />
            <Route path="zapier-workflow/manager" element={<WorkflowManager />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App; 