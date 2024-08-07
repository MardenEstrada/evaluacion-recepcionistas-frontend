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
    
        // Generar colores únicos para cada dataset
        const generateRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };
    
        const datasets = selectedData.map(recepcionista => {
            const totalEvaluaciones = recepcionista.count || 1; // Si no hay conteo, usamos 1 para evitar división por cero
    
            // Cálculo de promedios
            const promedioAmabilidad = (recepcionista.amabilidad || 0) / totalEvaluaciones;
            const promedioEficiencia = (recepcionista.eficiencia || 0) / totalEvaluaciones;
            const promedioPresentacion = (recepcionista.presentacion || 0) / totalEvaluaciones;
            const promedioConocimientoMenu = (recepcionista.conocimiento_menu || 0) / totalEvaluaciones;
            const promedioTiempoEspera = (recepcionista.tiempo_espera || 0) / totalEvaluaciones;
    
            return {
                label: `${recepcionista.nombre || 'Sin nombre'}`,
                data: [
                    promedioAmabilidad,
                    promedioEficiencia,
                    promedioPresentacion,
                    promedioConocimientoMenu,
                    promedioTiempoEspera,
                ],
                backgroundColor: generateRandomColor(), 
                borderColor: generateRandomColor(),
                borderWidth: 2,
                hoverBackgroundColor: generateRandomColor(),
                hoverBorderColor: generateRandomColor(),   
                pointBackgroundColor: generateRandomColor(), 
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            };
        });
    
        setChartData({
            labels,
            datasets
        });
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
                    color: '#ddd',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
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
                angleLines: {
                    display: true,
                    color: '#ddd'
                },
                grid: {
                    color: '#333'
                },
                pointLabels: {
                    font: {
                        size: 14,
                        weight: 'bold',
                        family: 'Segoe UI'
                    },
                    color: '#ddd'
                },
                ticks: {
                    display: false
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
