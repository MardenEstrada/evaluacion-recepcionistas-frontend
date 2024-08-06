import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // Importa el archivo CSS aquí

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <Link to="/registrar-recepcionista" className="nav-link">Registrar Recepcionista</Link>
        <Link to="/estadisticas" className="nav-link">Ver Estadísticas</Link>
      </div>
      <div className="content">
        <Outlet />
      </div>
      <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
    </div>
  );
};

export default Dashboard;
