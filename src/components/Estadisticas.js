import {
    Chart as ChartJS,
    Legend,
    LineElement,
    PointElement,
    RadarController,
    RadialLinearScale,
    Title,
    Tooltip
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import api from '../api'; // Archivo que contiene la configuración de Axios
import '../styles/Estadisticas.css'; // Importa el archivo CSS aquí

// Registra los componentes necesarios en Chart.js
ChartJS.register(
    RadarController,
    RadialLinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Estadisticas = () => {
    const [data, setData] = useState([]);
    const [selectedRecepcionistas, setSelectedRecepcionistas] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener todos los recepcionistas
                const recepcionistasResponse = await api.get('/recepcionistas');
                const recepcionistas = recepcionistasResponse.data;

                // Obtener todas las evaluaciones
                const evaluacionesResponse = await api.get('/evaluaciones');
                const evaluaciones = evaluacionesResponse.data;

                // Mapear los datos
                const evaluacionesMap = evaluaciones.reduce((acc, evaluation) => {
                    if (!acc[evaluation.recepcionista_id]) {
                        acc[evaluation.recepcionista_id] = {
                            amabilidad: 0,
                            eficiencia: 0,
                            presentacion: 0,
                            conocimiento_menu: 0,
                            tiempo_espera: 0,
                        };
                    }
                    acc[evaluation.recepcionista_id].amabilidad += evaluation.amabilidad || 0;
                    acc[evaluation.recepcionista_id].eficiencia += evaluation.eficiencia || 0;
                    acc[evaluation.recepcionista_id].presentacion += evaluation.presentacion || 0;
                    acc[evaluation.recepcionista_id].conocimiento_menu += evaluation.conocimiento_menu || 0;
                    acc[evaluation.recepcionista_id].tiempo_espera += evaluation.tiempo_espera || 0;
                    return acc;
                }, {});

                // Añadir evaluaciones a los recepcionistas
                const updatedRecepcionistas = recepcionistas.map(recepcionista => ({
                    ...recepcionista,
                    ...evaluacionesMap[recepcionista.id],
                }));

                setData(updatedRecepcionistas);
                updateChartData(updatedRecepcionistas, []);
            } catch (error) {
                console.error('Error al obtener los datos', error);
            }
        };

        fetchData();
    }, []);

    const handleSelectChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setSelectedRecepcionistas(selectedOptions);

        const selectedData = data.filter(recepcionista => selectedOptions.includes(recepcionista.id.toString()));

        updateChartData(selectedData);
    };
    
    const updateChartData = (selectedData) => {
        const labels = ['Amabilidad', 'Eficiencia', 'Presentación', 'Conocimiento del Menú', 'Tiempo de Espera'];
    
        const datasets = selectedData.map(recepcionista => ({
            label: `${recepcionista.nombre || 'Sin nombre'}`,
            data: [
                recepcionista.amabilidad || 0,
                recepcionista.eficiencia || 0,
                recepcionista.presentacion || 0,
                recepcionista.conocimiento_menu || 0,
                recepcionista.tiempo_espera || 0,
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }));
        
        setChartData({ labels, datasets });
    };

    return (
        <div className="container">
            <div className="chart-container">
                <h2>Estadísticas de Evaluación</h2>
                {chartData.datasets && chartData.datasets.length > 0 ? (
                    <div className="radar-chart">
                        <Radar 
                            data={chartData} 
                            options={{
                                maintainAspectRatio: false,
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'left',
                                        labels: {
                                            padding: 20,
                                            color: '#333',
                                            font: {
                                                size: 14
                                            }
                                        }
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                const label = context.dataset.label || '';
                                                const value = context.raw || 0;
                                                return `${label}: ${value}`;
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    r: {
                                        pointLabels: {
                                            font: {
                                                size: 14
                                            }
                                        },
                                        ticks: {
                                            display: true
                                        }
                                    }
                                }
                            }} 
                        />
                    </div>
                ) : (
                    <p>No hay datos disponibles para mostrar.</p>
                )}
            </div>
        </div>
    );
};

export default Estadisticas;
