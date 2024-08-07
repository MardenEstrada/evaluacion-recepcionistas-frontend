import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Estadisticas from './components/Estadisticas';
import EvaluacionPage from './components/EvaluacionPage';
import Login from './components/Login'; // Importa el componente de Login
import RegistrarRecepcionista from './components/RegistrarRecepcionista';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EvaluacionPage />} /> {/* Ruta inicial para Evaluaciones */}
        <Route path="/login" element={<Login />} /> {/* Ruta para Login */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="registrar-recepcionista" element={<RegistrarRecepcionista />} />
          <Route path="estadisticas" element={<Estadisticas />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
