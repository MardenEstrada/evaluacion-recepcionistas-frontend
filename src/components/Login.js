import axios, { formToJSON } from 'axios';
import React, { useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Importa el archivo CSS aquí

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); // Redirigir al dashboard después del login
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      setError('Por favor, verifica tus credenciales e intenta nuevamente.'); // Establecer el mensaje de error
    }
  };

  return (
  <main>
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          aria-label="correo de usuario"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          aria-label="contraseña de usuario"
          placeholder="****************"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && (
        <div className={`error-message ${error ? 'show' : ''}`}>
          {error}
        </div>
      )}
      <button className="submit-button" type="submit" name="submit">Iniciar Sesión</button>
    </form>
  </main>
  
  );  
  
};

export default Login;
