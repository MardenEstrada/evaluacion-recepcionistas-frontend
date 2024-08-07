import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './../styles/Dashboard.css';

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
        <Outlet />
      </main>
      <footer className="footer">
        <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
      </footer>
    </div>
  );
};

export default Dashboard;
