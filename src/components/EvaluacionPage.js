import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EvaluacionPage.css'; // Importa el archivo CSS aquí

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
      alert('Evaluación registrada con éxito');
      setEvaluacion({
        recepcionista_id: '',
        amabilidad: 5,
        eficiencia: 5,
        presentacion: 5,
        conocimiento_menu: 5,
        tiempo_espera: 5
      });
    } catch (error) {
      console.error('Error al registrar la evaluación', error.response ? error.response.data : error.message);
      alert('Error al registrar la evaluación');
    }
  };

  if (loading) return <p>Cargando recepcionistas...</p>;

  return (
    <div className="evaluacion-page">
      <h1>Formulario de Evaluación</h1>
      <button className="login-button" onClick={() => navigate('/login')}>Iniciar Sesión</button>
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
          {['amabilidad', 'eficiencia', 'presentacion', 'conocimiento_menu', 'tiempo_espera'].map((aspect, index) => (
            <div className="range-group" key={index}>
              <label htmlFor={aspect}>{aspect.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}:</label>
              <input
                type="range"
                id={aspect}
                name={aspect}
                min="1"
                max="10"
                value={evaluacion[aspect]}
                onChange={handleChange}
              />
              <span className="range-value">{evaluacion[aspect]}</span>
            </div>
          ))}
        </div>
        <button className="submit-button" type="submit">Enviar Evaluación</button>
      </form>
    </div>
  );
}

export default EvaluacionPage;
