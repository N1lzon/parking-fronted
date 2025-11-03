import React, { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { loginAdmin } from './services/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [activeView, setActiveView] = useState('dashboard');

  const handleLogin = async (nombre, contraseña) => {
    const admin = await loginAdmin(nombre, contraseña);
    setAdminName(admin.nombre);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      setIsAuthenticated(false);
      setAdminName('');
      setActiveView('dashboard');
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <div className="placeholder-view">Vista de Usuarios (Próximamente)</div>;
      case 'reports':
        return <div className="placeholder-view">Vista de Reportes (Próximamente)</div>;
      case 'settings':
        return <div className="placeholder-view">Vista de Configuración (Próximamente)</div>;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
        adminName={adminName}
      />
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default App;