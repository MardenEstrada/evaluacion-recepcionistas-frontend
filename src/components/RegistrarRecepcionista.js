// src/components/RegistrarRecepcionista.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const RegistrarRecepcionista = () => {
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/recepcionistas', { nombre, dni });
      navigate('/');  // Redirigir al dashboard después de agregar
    } catch (error) {
      console.error('Error al registrar el recepcionista', error);
    }
  };

  return (
    <div className="container">
      <h2>Registrar Recepcionista</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dni" className="form-label">DNI</label>
          <input
            type="text"
            id="dni"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Registrar</button>
      </form>
    </div>
  );
};

export default RegistrarRecepcionista;
