import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Estadisticas from './components/Estadisticas';
import EvaluacionPage from './components/EvaluacionPage';
import Login from './components/Login';
import RegistrarRecepcionista from './components/RegistrarRecepcionista';

const PrivateRoute = ({ element: Component }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EvaluacionPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />}>
          <Route path="registrar-recepcionista" element={<PrivateRoute element={RegistrarRecepcionista} />} />
          <Route path="estadisticas" element={<PrivateRoute element={Estadisticas} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;