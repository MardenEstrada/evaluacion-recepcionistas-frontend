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
import api from '../api'; 
import '../styles/Estadisticas.css'; 

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
                const recepcionistasResponse = await api.get('/recepcionistas');
                const recepcionistas = recepcionistasResponse.data;

                const evaluacionesResponse = await api.get('/evaluaciones');
                const evaluaciones = evaluacionesResponse.data;

                const evaluacionesMap = evaluaciones.reduce((acc, evaluation) => {
                    if (!acc[evaluation.recepcionista_id]) {
                        acc[evaluation.recepcionista_id] = {
                            amabilidad: 0,
                            eficiencia: 0,
                            presentacion: 0,
                            conocimiento_menu: 0,
                            tiempo_espera: 0,
                            count: 0
                        };
                    }
                    acc[evaluation.recepcionista_id].amabilidad += evaluation.amabilidad || 0;
                    acc[evaluation.recepcionista_id].eficiencia += evaluation.eficiencia || 0;
                    acc[evaluation.recepcionista_id].presentacion += evaluation.presentacion || 0;
                    acc[evaluation.recepcionista_id].conocimiento_menu += evaluation.conocimiento_menu || 0;
                    acc[evaluation.recepcionista_id].tiempo_espera += evaluation.tiempo_espera || 0;
                    acc[evaluation.recepcionista_id].count += 1; 
                    return acc;
                }, {});

                const updatedRecepcionistas = recepcionistas.map(recepcionista => ({
                    ...recepcionista,
                    ...evaluacionesMap[recepcionista.id],
                }));

                setData(updatedRecepcionistas);
                if (selectedRecepcionistas.length > 0) {
                    const selectedData = updatedRecepcionistas.filter(recepcionista => selectedRecepcionistas.includes(recepcionista.id.toString()));
                    updateChartData(selectedData);
                }
            } catch (error) {
                console.error('Error al obtener los datos', error);
            }
        };

        fetchData();
    }, []);

    const handleSelectChange = () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const selectedOptions = Array.from(checkboxes).map(checkbox => checkbox.value);
        setSelectedRecepcionistas(selectedOptions);

        const selectedData = data.filter(recepcionista => selectedOptions.includes(recepcionista.id.toString()));

        updateChartData(selectedData);
    };

    const handleDivClick = (id) => {
        const checkbox = document.getElementById(`checkbox-${id}`);
        if (checkbox) {
            checkbox.click();
        }
    };

    const redondearNumero = (numero) => Math.round(numero * 10) / 10;

    const updateChartData = (selectedData) => {
        const labels = ['Amabilidad', 'Eficiencia', 'Presentación', 'Conocimiento del Menú', 'Tiempo de Espera'];

        const generateRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };

        const datasets = selectedData.map(recepcionista => {
            const totalEvaluaciones = recepcionista.count || 1;

            const promedioAmabilidad = redondearNumero((recepcionista.amabilidad || 0) / totalEvaluaciones);
            const promedioEficiencia = redondearNumero((recepcionista.eficiencia || 0) / totalEvaluaciones);
            const promedioPresentacion = redondearNumero((recepcionista.presentacion || 0) / totalEvaluaciones);
            const promedioConocimientoMenu = redondearNumero((recepcionista.conocimiento_menu || 0) / totalEvaluaciones);
            const promedioTiempoEspera = redondearNumero((recepcionista.tiempo_espera || 0) / totalEvaluaciones);

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
        <div className="statistics-container">
            <div className="recepcionistas-list">
                <h2>Recepcionistas</h2>
                {data.length > 0 ? (
                    data.map(recepcionista => (
                        <div key={recepcionista.id} className="recepcionista-item">
                            <input
                                id={`checkbox-${recepcionista.id}`}
                                type="checkbox"
                                value={recepcionista.id}
                                checked={selectedRecepcionistas.includes(recepcionista.id.toString())}
                                onChange={handleSelectChange}
                                className="recepcionista-checkbox"
                            />
                            <div 
                                className="recepcionista-info"
                                onClick={() => handleDivClick(recepcionista.id)}
                            >
                                <span className='name-recepcionista'>{recepcionista.nombre || 'Sin nombre'}</span>
                                <span className='client'>Clientes atendidos: {recepcionista.count || 0}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay recepcionistas disponibles.</p>
                )}
            </div>

            <div className="chart-container">
                {chartData.datasets.length > 0 ? (
                    <Radar
                        data={chartData}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false 
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
                                        color: '#8a8a8a'
                                    },
                                    pointLabels: {
                                        font: {
                                            size: 14,
                                            weight: '300',
                                            family: 'sans-serif'
                                        },
                                        color: '#ddd'
                                    },
                                    ticks: {
                                        stepSize: 1,
                                        min: 0,
                                        max: 10,
                                        display: true,
                                        color: '#ddd',
                                        backdropColor: '#0004',
                                        padding: 10,
                                        font: {
                                            size: 12,
                                            weight: '700',
                                            family: 'sans-serif'
                                        },
                                        maxTicksLimit: 11,
                                        showLabelBackdrop: true,
                                        labelOffset: 20
                                    }
                                }
                            }
                        }}
                    />
                ) : (
                    <p className='message-center'>No hay datos disponibles para mostrar.</p>
                )}
            </div>
            <div className="legend-container">
                <h2>Leyenda de Colores</h2>
                {chartData.datasets.map(dataset => (
                    <div key={dataset.label} className="legend-item">
                        <div
                            className="legend-color-box"
                            style={{ backgroundColor: dataset.borderColor }}
                        ></div>
                        <span>{dataset.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Estadisticas;
