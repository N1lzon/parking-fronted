import React, { useState } from 'react';
import './ExportModal.css';

const ExportModal = ({ onClose, metricsData, estadisticas }) => {
  const [format, setFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState({
    inicio: '',
    fin: ''
  });
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!dateRange.inicio || !dateRange.fin) {
      alert('Por favor seleccione un rango de fechas');
      return;
    }

    setLoading(true);
    
    try {
      if (format === 'csv') {
        exportToCSV();
      } else {
        exportToPDF();
      }
    } catch (error) {
      alert('Error al exportar reporte');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Métrica', 'Valor'],
      ['Total de Vehículos', metricsData.totalVehiculos],
      ['Tiempo Promedio (horas)', metricsData.tiempoPromedio],
      ['Estacionamiento Lleno (veces)', metricsData.estacionamientoLleno],
      ['Solicitudes Rechazadas', metricsData.solicitudesRechazadas],
      ['Asignaciones No Utilizadas', metricsData.asignacionesNoUtilizadas],
      ['Ocupaciones Sin Asignar', metricsData.ocupacionesSinAsignar],
      ['Total de Incidentes', estadisticas.total_incidentes],
      ['', ''],
      ['Horas Pico', 'Ocupación (%)'],
      ...metricsData.horasPico.map(h => [h.hora, h.ocupacion]),
      ['', ''],
      ['Estado Actual', ''],
      ['Total Espacios', estadisticas.total_espacios],
      ['Espacios Disponibles', estadisticas.espacios_disponibles],
      ['Espacios Ocupados', estadisticas.espacios_ocupados],
      ['Espacios Reservados', estadisticas.espacios_reservados]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_${dateRange.inicio}_${dateRange.fin}.csv`;
    link.click();

    setTimeout(() => {
      onClose();
      alert('Reporte CSV descargado exitosamente');
    }, 500);
  };

  const exportToPDF = () => {
    // Simulación de exportación a PDF
    // En producción, usar una librería como jsPDF o pdfmake
    
    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Estacionamiento</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            color: #1a1a1a;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
          }
          .header {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .metric-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .metric-label {
            font-weight: 600;
            color: #4b5563;
          }
          .metric-value {
            font-weight: 700;
            color: #1a1a1a;
          }
          .section {
            margin: 30px 0;
          }
          .section h2 {
            color: #374151;
            font-size: 1.2rem;
            margin-bottom: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          th {
            background: #f3f4f6;
            font-weight: 600;
            color: #374151;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #6b7280;
            font-size: 0.9rem;
          }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Reporte de Estacionamiento</h1>
        
        <div class="header">
          <p><strong>Período:</strong> ${dateRange.inicio} a ${dateRange.fin}</p>
          <p><strong>Generado:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div class="section">
          <h2>Métricas Principales</h2>
          <div class="metric-row">
            <span class="metric-label">Total de Vehículos Registrados</span>
            <span class="metric-value">${metricsData.totalVehiculos}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Tiempo Promedio de Estacionamiento</span>
            <span class="metric-value">${metricsData.tiempoPromedio} horas</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Veces que Estacionamiento Estuvo Lleno</span>
            <span class="metric-value">${metricsData.estacionamientoLleno}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Solicitudes Rechazadas (Sin Espacio)</span>
            <span class="metric-value">${metricsData.solicitudesRechazadas}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Asignaciones No Utilizadas</span>
            <span class="metric-value">${metricsData.asignacionesNoUtilizadas}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Ocupaciones Sin Asignar (Incidentes)</span>
            <span class="metric-value">${metricsData.ocupacionesSinAsignar}</span>
          </div>
        </div>

        <div class="section">
          <h2>Horas Pico</h2>
          <table>
            <thead>
              <tr>
                <th>Horario</th>
                <th>Ocupación</th>
              </tr>
            </thead>
            <tbody>
              ${metricsData.horasPico.map(peak => `
                <tr>
                  <td>${peak.hora}</td>
                  <td>${peak.ocupacion}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Estado Actual de Espacios</h2>
          <div class="metric-row">
            <span class="metric-label">Total de Espacios</span>
            <span class="metric-value">${estadisticas.total_espacios}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Espacios Disponibles</span>
            <span class="metric-value">${estadisticas.espacios_disponibles}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Espacios Ocupados</span>
            <span class="metric-value">${estadisticas.espacios_ocupados}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Espacios Reservados</span>
            <span class="metric-value">${estadisticas.espacios_reservados}</span>
          </div>
        </div>

        <div class="section">
          <h2>Incidentes</h2>
          <div class="metric-row">
            <span class="metric-label">Total de Incidentes Registrados</span>
            <span class="metric-value">${estadisticas.total_incidentes}</span>
          </div>
        </div>

        <div class="footer">
          <p>Sistema de Gestión de Estacionamiento - Reporte Generado Automáticamente</p>
        </div>

        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-right: 10px;">
            Imprimir / Guardar como PDF
          </button>
          <button onclick="window.close()" style="padding: 12px 30px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
            Cerrar
          </button>
        </div>
      </body>
      </html>
    `);
    pdfWindow.document.close();

    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="export-overlay">
      <div className="export-modal">
        <button onClick={onClose} className="btn-close-export">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <h2>Exportar Reporte</h2>
        <p className="export-subtitle">Seleccione el formato y rango de fechas</p>

        <div className="export-form">
          <div className="form-group">
            <label>Formato de Exportación</label>
            <div className="format-options">
              <button
                onClick={() => setFormat('pdf')}
                className={`format-btn ${format === 'pdf' ? 'active' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                PDF con Gráficos
              </button>
              <button
                onClick={() => setFormat('csv')}
                className={`format-btn ${format === 'csv' ? 'active' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                CSV (Excel)
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Fecha de Inicio</label>
            <input
              type="date"
              value={dateRange.inicio}
              onChange={(e) => setDateRange({ ...dateRange, inicio: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Fecha de Fin</label>
            <input
              type="date"
              value={dateRange.fin}
              onChange={(e) => setDateRange({ ...dateRange, fin: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              min={dateRange.inicio}
            />
          </div>

          <div className="export-info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>
              {format === 'pdf' 
                ? 'El reporte PDF incluirá gráficos y visualizaciones detalladas'
                : 'El archivo CSV puede ser abierto en Excel u otras hojas de cálculo'}
            </span>
          </div>

          <div className="export-actions">
            <button onClick={onClose} className="btn-cancel-export">
              Cancelar
            </button>
            <button 
              onClick={handleExport} 
              disabled={loading || !dateRange.inicio || !dateRange.fin}
              className="btn-export-confirm"
            >
              {loading ? 'Generando...' : 'Exportar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;