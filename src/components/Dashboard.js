import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirige al inicio de sesión o página principal
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <Link to="registrar-recepcionista" className="nav-link">Registrar Recepcionista</Link>
            </li>
            <li>
              <Link to="estadisticas" className="nav-link">Ver Estadísticas</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <h1>Sistema de evaluacion de Recepcionistas</h1>
        <Outlet />
      </main>
      <footer className="footer">
        <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
      </footer>
    </div>
  );
};

export default Dashboard;
