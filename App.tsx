import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HRProvider, useHR } from './context/HRContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';
import Login from './pages/Login';

const AppRoutes = () => {
  const { user } = useHR();

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <HRProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </HRProvider>
  );
};

export default App;