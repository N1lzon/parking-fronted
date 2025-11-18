import React, { useState, useEffect } from 'react';
import { getEstadisticas, getAsignacionesActivas } from '../services/api';
import ExportModal from './ExportModal';
import './Reports.css';

const Reports = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [metricsData, setMetricsData] = useState({
    totalVehiculos: 0,
    tiempoPromedio: 0,
    horasPico: [],
    estacionamientoLleno: 0,
    solicitudesRechazadas: 0,
    asignacionesNoUtilizadas: 0,
    ocupacionesSinAsignar: 0,
    tiempoFueraServicio: []
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const stats = await getEstadisticas();
      setEstadisticas(stats);
      
      // Calcular métricas adicionales (simuladas por ahora)
      setMetricsData({
        totalVehiculos: stats.total_asignaciones,
        tiempoPromedio: stats.promedio_horas_ocupacion,
        horasPico: calculatePeakHours(),
        estacionamientoLleno: Math.floor(stats.total_asignaciones * 0.15),
        solicitudesRechazadas: Math.floor(stats.total_asignaciones * 0.08),
        asignacionesNoUtilizadas: Math.floor(stats.total_asignaciones * 0.05),
        ocupacionesSinAsignar: stats.total_incidentes,
        tiempoFueraServicio: []
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setLoading(false);
    }
  };

  const calculatePeakHours = () => {
    // Simulación de horas pico
    return [
      { hora: '08:00-09:00', ocupacion: 95 },
      { hora: '12:00-13:00', ocupacion: 88 },
      { hora: '18:00-19:00', ocupacion: 92 }
    ];
  };

  const getOcupacionPercentage = () => {
    if (!estadisticas) return 0;
    return Math.round((estadisticas.espacios_ocupados / estadisticas.total_espacios) * 100);
  };

  if (loading) {
    return (
      <div className="reports-loading">
        <div className="spinner-large"></div>
        <p>Cargando reportes...</p>
      </div>
    );
  }

  return (
    <div className="reports">
      <div className="reports-header">
        <div>
          <h1>Reportes y Análisis</h1>
          <p className="subtitle">Métricas y estadísticas del sistema</p>
        </div>
        <button 
          onClick={() => setShowExportModal(true)}
          className="btn-export"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Exportar Reporte
        </button>
      </div>

      {/* Métricas Principales */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon blue">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-value">{metricsData.totalVehiculos}</div>
            <div className="metric-label">Total de Vehículos</div>
          </div>
        </div>

        <div className="metric-card primary">
          <div className="metric-icon green">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-value">{metricsData.tiempoPromedio}h</div>
            <div className="metric-label">Tiempo Promedio</div>
          </div>
        </div>

        <div className="metric-card primary">
          <div className="metric-icon purple">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-value">{getOcupacionPercentage()}%</div>
            <div className="metric-label">Ocupación Actual</div>
          </div>
        </div>

        <div className="metric-card primary">
          <div className="metric-icon red">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-value">{metricsData.ocupacionesSinAsignar}</div>
            <div className="metric-label">Ocupaciones Sin Asignar</div>
          </div>
        </div>
      </div>

      {/* Gráficos y Detalles */}
      <div className="charts-grid">
        {/* Horas Pico */}
        <div className="chart-card">
          <h3>Horas Pico</h3>
          <div className="peak-hours">
            {metricsData.horasPico.map((peak, index) => (
              <div key={index} className="peak-item">
                <div className="peak-header">
                  <span className="peak-time">{peak.hora}</span>
                  <span className="peak-value">{peak.ocupacion}%</span>
                </div>
                <div className="peak-bar">
                  <div 
                    className="peak-fill" 
                    style={{ width: `${peak.ocupacion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas de Uso */}
        <div className="chart-card">
          <h3>Estadísticas de Uso</h3>
          <div className="usage-stats">
            <div className="usage-item">
              <div className="usage-label">Estacionamiento Lleno</div>
              <div className="usage-value">{metricsData.estacionamientoLleno} veces</div>
            </div>
            <div className="usage-item">
              <div className="usage-label">Solicitudes Rechazadas</div>
              <div className="usage-value">{metricsData.solicitudesRechazadas} veces</div>
            </div>
            <div className="usage-item">
              <div className="usage-label">Asignaciones No Utilizadas</div>
              <div className="usage-value">{metricsData.asignacionesNoUtilizadas} veces</div>
            </div>
          </div>
        </div>

        {/* Distribución de Espacios */}
        <div className="chart-card">
          <h3>Distribución de Espacios</h3>
          <div className="distribution-chart">
            <div className="donut-chart">
              <svg viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="20"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#667eea" 
                  strokeWidth="20"
                  strokeDasharray={`${getOcupacionPercentage() * 2.51} 251.2`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="donut-center">
                <div className="donut-value">{getOcupacionPercentage()}%</div>
                <div className="donut-label">Ocupado</div>
              </div>
            </div>
            <div className="distribution-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#52c87a' }}></span>
                <span>Disponibles: {estadisticas?.espacios_disponibles}</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#667eea' }}></span>
                <span>Ocupados: {estadisticas?.espacios_ocupados}</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#fbbf24' }}></span>
                <span>Reservados: {estadisticas?.espacios_reservados}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Incidentes */}
        <div className="chart-card">
          <h3>Resumen de Incidentes</h3>
          <div className="incidents-summary">
            <div className="incident-stat">
              <div className="incident-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div className="incident-content">
                <div className="incident-value">{estadisticas?.total_incidentes || 0}</div>
                <div className="incident-label">Total de Incidentes</div>
              </div>
            </div>
            <div className="incident-note">
              Los incidentes más comunes incluyen ocupaciones sin asignación y problemas con sensores.
            </div>
          </div>
        </div>
      </div>

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          metricsData={metricsData}
          estadisticas={estadisticas}
        />
      )}
    </div>
  );
};

export default Reports;