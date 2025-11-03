import React, { useState, useEffect } from 'react';
import { getEspacios, liberarEspacio, updateEspacio, getEstadisticas } from '../services/api';
import ConfirmModal from './ConfirmModal';
import './Dashboard.css';

const Dashboard = () => {
  const [espacios, setEspacios] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [espaciosEditados, setEspaciosEditados] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({});

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [espaciosData, statsData] = await Promise.all([
        getEspacios(),
        getEstadisticas()
      ]);
      setEspacios(espaciosData);
      setEstadisticas(statsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handleLiberarEspacio = async (id) => {
    setConfirmModalConfig({
      title: '¿Liberar espacio?',
      message: '¿Está seguro de liberar este espacio?',
      type: 'warning',
      onConfirm: async () => {
        setShowConfirmModal(false);
        setLoading(true);
        try {
          await liberarEspacio(id);
          await loadData();
        } catch (error) {

        } finally {
          setLoading(false);
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleLiberarTodos = async () => {
    setConfirmModalConfig({
      title: '¿Liberar todos los espacios?',
      message: 'Esta acción liberará TODOS los espacios ocupados. ¿Está seguro?',
      type: 'danger',
      onConfirm: async () => {
        setShowConfirmModal(false);
        setLoading(true);
        try {
          const espaciosOcupados = espacios.filter(e => e.estado === 'ocupado');
          await Promise.all(espaciosOcupados.map(e => liberarEspacio(e.id)));
          await loadData();
        } catch (error) {

        } finally {
          setLoading(false);
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleIniciarEdicion = () => {

    const estado = {};
    espacios.forEach(espacio => {
      estado[espacio.id] = espacio.reservado === 'si';
    });
    setEspaciosEditados(estado);
    setModoEdicion(true);
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    setEspaciosEditados({});
  };

  const handleToggleReservado = (espacioId) => {
    setEspaciosEditados(prev => ({
      ...prev,
      [espacioId]: !prev[espacioId]
    }));
  };

  const handleGuardarCambios = () => {
    setConfirmModalConfig({
      title: '¿Guardar cambios?',
      message: 'Se actualizarán los espacios reservados según su selección.',
      type: 'info',
      onConfirm: async () => {
        setShowConfirmModal(false);
        setLoading(true);
        try {
          const promesas = [];
          espacios.forEach(espacio => {
            const nuevoEstado = espaciosEditados[espacio.id] ? 'si' : 'no';
            if (nuevoEstado !== espacio.reservado) {
              promesas.push(
                updateEspacio(espacio.id, { reservado: nuevoEstado })
              );
            }
          });

          await Promise.all(promesas);
          await loadData();
          setModoEdicion(false);
          setEspaciosEditados({});

        } catch (error) {

        } finally {
          setLoading(false);
        }
      }
    });
    setShowConfirmModal(true);
  };

  const getEstadoClass = (espacio) => {
    if (modoEdicion) {
      // En modo edición, solo usamos las clases de edición
      return '';
    }
    if (espacio.estado === 'ocupado') return 'ocupado';
    if (espacio.reservado === 'si') return 'reservado';
    return 'libre';
  };

  const getEstadoClassEdicion = (espacio) => {
    return espaciosEditados[espacio.id] ? 'reservado-edit' : 'normal-edit';
  };

  const getEstadoLabel = (espacio) => {
    if (espacio.estado === 'ocupado') return 'Ocupado';
    if (espacio.reservado === 'si') return 'Reservado';
    return 'Libre';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Panel de Control</h1>
        <div className="header-actions">
          {!modoEdicion ? (
            <>
              <button 
                onClick={handleIniciarEdicion}
                disabled={loading}
                className="btn-editar-reservas"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Editar Reservas
              </button>
              <button 
                onClick={handleLiberarTodos} 
                disabled={loading}
                className="btn-liberar-todos"
              >
                Liberar Todos los Espacios
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleCancelarEdicion}
                disabled={loading}
                className="btn-cancelar"
              >
                Cancelar
              </button>
              <button 
                onClick={handleGuardarCambios}
                disabled={loading}
                className="btn-guardar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Guardar Cambios
              </button>
            </>
          )}
        </div>
      </div>

      {modoEdicion && (
        <div className="edit-info">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>Haga clic en los espacios para marcar/desmarcar como reservados</span>
        </div>
      )}

      {estadisticas && !modoEdicion && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Espacios</div>
              <div className="stat-value">{estadisticas.total_espacios}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Disponibles</div>
              <div className="stat-value">{estadisticas.espacios_disponibles}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Ocupados</div>
              <div className="stat-value">{estadisticas.espacios_ocupados}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Reservados</div>
              <div className="stat-value">{estadisticas.espacios_reservados}</div>
            </div>
          </div>
        </div>
      )}

      <div className="spaces-section">
        <h2>{modoEdicion ? 'Editar Espacios Reservados' : 'Gestión de Espacios'}</h2>
        <div className="spaces-grid">
          {espacios.map((espacio) => (
            <div 
              key={espacio.id} 
              className={`space-card ${modoEdicion ? getEstadoClassEdicion(espacio) : getEstadoClass(espacio)} ${modoEdicion ? 'editable' : ''}`}
              onClick={modoEdicion ? () => handleToggleReservado(espacio.id) : undefined}
            >
              <div className="space-header">
                <div className="space-number">{espacio.numero_de_espacio}</div>
                {!modoEdicion && (
                  <div className={`space-badge ${getEstadoClass(espacio)}`}>
                    {getEstadoLabel(espacio)}
                  </div>
                )}
                {modoEdicion && (
                  <div className="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={espaciosEditados[espacio.id] || false}
                      onChange={() => handleToggleReservado(espacio.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>
              
              {!modoEdicion && espacio.reservado === 'si' && (
                <div className="space-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Espacio Reservado
                </div>
              )}

              {modoEdicion && (
                <div className="edit-indicator">
                  {espaciosEditados[espacio.id] ? 'Reservado' : 'Normal'}
                </div>
              )}

              {!modoEdicion && espacio.estado === 'ocupado' && (
                <button
                  onClick={() => handleLiberarEspacio(espacio.id)}
                  disabled={loading}
                  className="btn-liberar"
                >
                  Liberar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          title={confirmModalConfig.title}
          message={confirmModalConfig.message}
          type={confirmModalConfig.type}
          onConfirm={confirmModalConfig.onConfirm}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;