import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../styles/RegistrarRecepcionista.css'

const RegistrarRecepcionista = () => {
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/v1/recepcionistas', { nombre, dni });
      navigate('/');  // Redirigir al dashboard después de agregar
      setError('');
    } catch (error) {
      console.error('Error al registrar el recepcionista', error);
      setError('Error al registrar el recepcionista. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="registrar-recepcionista">
      <header>
        <h2>Registrar Recepcionista</h2>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dni">DNI:</label>
            <input
              type="number"
              id="dni"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="form-control"
              required
            />
          </div>
          {error && <div className={`error-message ${error ? 'show' : ''}`}>{error}</div>}
          <button type="submit" className="submit-button">Registrar</button>
        </form>
      </main>
    </div>
  );
};

export default RegistrarRecepcionista;
