import React, { useState, useEffect } from 'react';
import AssignmentModal from './components/AssignmentModal';
import EmployeeLogin from './components/EmployeeLogin';
import ErrorModal from './components/ErrorModal';
import { getEspacios, solicitarEspacioNormal, solicitarEspacioReservado, verificarUsuarioReserva } from './services/api';
import './App.css';

function App() {
  const [espacios, setEspacios] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showEmployeeLogin, setShowEmployeeLogin] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [espacioAsignado, setEspacioAsignado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEspacios();
    // Actualizar espacios cada 5 segundos
    const interval = setInterval(loadEspacios, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadEspacios = async () => {
    try {
      const data = await getEspacios();
      setEspacios(data);
    } catch (error) {
      console.error('Error al cargar espacios:', error);
    }
  };

  const handlePedirLugar = async () => {
    setLoading(true);
    try {
      const asignacion = await solicitarEspacioNormal();
      setEspacioAsignado(asignacion.espacio.numero_de_espacio);
      setShowAssignmentModal(true);
      await loadEspacios();
    } catch (error) {
      if (error.response?.status === 404) {
        setErrorMessage('No hay espacios disponibles en este momento. Por favor, espere.');
      } else {
        setErrorMessage('Error al solicitar espacio. Intente nuevamente.');
      }
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSubmit = async (ci) => {
    setLoading(true);
    setShowEmployeeLogin(false);
    
    try {
      // Verificar que el usuario existe
      const usuario = await verificarUsuarioReserva(ci);
      
      if (!usuario) {
        setErrorMessage('CI no encontrado. Usted no está registrado como empleado.');
        setShowErrorModal(true);
        setLoading(false);
        return;
      }

      // Solicitar espacio reservado
      const asignacion = await solicitarEspacioReservado(ci);
      setEspacioAsignado(asignacion.espacio.numero_de_espacio);
      setShowAssignmentModal(true);
      await loadEspacios();
    } catch (error) {
      if (error.response?.status === 404) {
        setErrorMessage('No hay espacios reservados disponibles en este momento.');
      } else {
        setErrorMessage('Error al procesar la solicitud. Intente nuevamente.');
      }
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAssignmentModal = () => {
    setShowAssignmentModal(false);
    setEspacioAsignado(null);
  };

  // Verificar si hay espacios disponibles
  const espaciosLibresNormales = espacios.filter(e => e.estado === 'libre' && e.reservado === 'no').length;
  const espaciosLibresReservados = espacios.filter(e => e.estado === 'libre' && e.reservado === 'si').length;

  return (
    <div className="app">
      <div className="app-container">
        <div className="header">
          <h1>🚗 Sistema de Estacionamiento</h1>
          <div className="subtitle">Bienvenido</div>
        </div>

        <div className="main-content">
          <div className="info-panel">
            <div className="info-item">
              <div className="info-icon">🅿️</div>
              <div className="info-text">
                <div className="info-label">Espacios Disponibles</div>
                <div className="info-value">{espaciosLibresNormales}</div>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">⭐</div>
              <div className="info-text">
                <div className="info-label">Espacios Reservados</div>
                <div className="info-value">{espaciosLibresReservados}</div>
              </div>
            </div>
          </div>

          <div className="button-container">
            <button
              onClick={handlePedirLugar}
              disabled={loading || espaciosLibresNormales === 0}
              className="btn-main btn-request"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Procesando...
                </>
              ) : (
                <>
                  <span className="btn-icon">🅿️</span>
                  Pedir Lugar
                </>
              )}
            </button>

            <button
              onClick={() => setShowEmployeeLogin(true)}
              disabled={loading || espaciosLibresReservados === 0}
              className="btn-main btn-employee"
            >
              <span className="btn-icon">👤</span>
              Soy Empleado
            </button>

            <button
              disabled={true}
              className="btn-main btn-help"
            >
              <span className="btn-icon">❓</span>
              Pedir Ayuda
            </button>
          </div>
        </div>

        <div className="footer">
          Sistema de Gestión de Estacionamiento v1.0
        </div>
      </div>

      {showAssignmentModal && (
        <AssignmentModal
          espacios={espacios}
          numeroEspacioAsignado={espacioAsignado}
          onClose={handleCloseAssignmentModal}
        />
      )}

      {showEmployeeLogin && (
        <EmployeeLogin
          onSubmit={handleEmployeeSubmit}
          onCancel={() => setShowEmployeeLogin(false)}
        />
      )}

      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
}

export default App;