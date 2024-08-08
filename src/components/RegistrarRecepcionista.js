import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../styles/RegistrarRecepcionista.css';

const Formulario = () => {
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleDniChange = (e) => {
      const value = e.target.value;
      if (/^\d{0,8}$/.test(value)) {
          setDni(value);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/v1/recepcionistas', { nombre, dni });
      setSuccess('Recepcionista registrado con éxito.');
      setError('');
      setNombre('');
      setDni('');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error al registrar el recepcionista', error);
      if (error.response) {
        setError(`Error al registrar el recepcionista: ${error.response.data.message || 'Por favor, intenta nuevamente.'}`);
      } else {
        setError('Error al registrar el recepcionista. Por favor, intenta nuevamente.');
      }
      setSuccess('');
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
                type="text"
                id="dni"
                value={dni}
                onChange={handleDniChange}
                className="form-control"
                required
                maxLength={8}
                inputMode="numeric"
            />
          </div>
          {success && <div className="success-message">{success}</div>}
          {error && <div className={`error-message ${error ? 'show' : ''}`}>{error}</div>}
          <button type="submit" className="submit-button">Registrar</button>
        </form>
      </main>
    </div>
  );
};

export default Formulario;
