import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';
import { isAuthenticated } from './services/auth';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
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
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App; 