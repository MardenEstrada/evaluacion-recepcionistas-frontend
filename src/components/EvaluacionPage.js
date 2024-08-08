import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EvaluacionPage.css'

function EvaluacionPage() {
  const [evaluacion, setEvaluacion] = useState({
    recepcionista_id: '',
    amabilidad: 5,
    eficiencia: 5,
    presentacion: 5,
    conocimiento_menu: 5,
    tiempo_espera: 5
  });
  const [recepcionistas, setRecepcionistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecepcionistas = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/recepcionistas');
        setRecepcionistas(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener recepcionistas', error);
        setLoading(false);
      }
    };

    fetchRecepcionistas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvaluacion(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/v1/evaluaciones', evaluacion);
      setSuccessMessage('¡Evaluación registrada con éxito!');
      setEvaluacion({
        recepcionista_id: '',
        amabilidad: 5,
        eficiencia: 5,
        presentacion: 5,
        conocimiento_menu: 5,
        tiempo_espera: 5
      });
      setError('');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error al registrar la evaluación', error.response ? error.response.data : error.message);
      setError('Error al registrar la evaluación. Por favor, intenta nuevamente.');
      setSuccessMessage('');
    }
  };

  if (loading) return <p>Cargando recepcionistas...</p>;

  return (
    <div className="evaluacion-page">
      <header>
        <h1>Formulario de Evaluación</h1>
        <button className="login-button" onClick={() => navigate('/login')}>Iniciar Sesión</button>
      </header>
      <main>
        {successMessage && <div className="success-message">{successMessage}</div>} {/* Mensaje de éxito */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="recepcionista_id">Selecciona un Recepcionista:</label>
            <select
              id="recepcionista_id"
              name="recepcionista_id"
              value={evaluacion.recepcionista_id}
              onChange={handleChange}
            >
              <option value="">Selecciona...</option>
              {recepcionistas.map(recepcionista => (
                <option key={recepcionista.id} value={recepcionista.id}>
                  {recepcionista.nombre} {recepcionista.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="evaluation-criteria">
            <h3>Aspectos a Evaluar</h3>
            {[
              { id: 'amabilidad', label: 'Amabilidad', description: 'Califica la cordialidad y atención del recepcionista.' },
              { id: 'eficiencia', label: 'Eficiencia', description: 'Evalúa la rapidez y eficacia en el servicio.' },
              { id: 'presentacion', label: 'Presentación', description: 'Observa la apariencia y vestimenta del recepcionista.' },
              { id: 'conocimiento_menu', label: 'Conocimiento del Menú', description: 'Considera el conocimiento del menú por parte del recepcionista.' },
              { id: 'tiempo_espera', label: 'Tiempo de Espera', description: 'Evalúa el tiempo que tardaste en ser atendido.' }
            ].map((aspect, index) => (
              <div className="range-group" key={index}>
                <label htmlFor={aspect.id} title={aspect.description}>
                  {aspect.label}:
                </label>
                <input
                  type="range"
                  id={aspect.id}
                  name={aspect.id}
                  min="1"
                  max="10"
                  value={evaluacion[aspect.id]}
                  onChange={handleChange}
                />
                <span className="range-value">{evaluacion[aspect.id]}</span>
              </div>
            ))}
          </div>
          {error && <div className={`error-message ${error ? 'show' : ''}`}>{error}</div>}
          <button className="submit-button" type="submit">Enviar Evaluación</button>
        </form>
      </main>
    </div>
  );
}

export default EvaluacionPage;
