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
    
    try {
      const usuario = await verificarUsuarioReserva(ci);
      
      if (!usuario) {
        setShowEmployeeLogin(false);
        setErrorMessage('CI no encontrado. Usted no está registrado como empleado.');
        setShowErrorModal(true);
        setLoading(false);
        return;
      }

      const asignacion = await solicitarEspacioReservado(ci);
      setShowEmployeeLogin(false);
      setEspacioAsignado(asignacion.espacio.numero_de_espacio);
      setShowAssignmentModal(true);
      await loadEspacios();
    } catch (error) {
      setShowEmployeeLogin(false);
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

  const espaciosLibresNormales = espacios.filter(e => e.estado === 'libre' && e.reservado === 'no').length;
  const espaciosLibresReservados = espacios.filter(e => e.estado === 'libre' && e.reservado === 'si').length;

  return (
    <div className="app">
      <div className="app-container">
        <header className="header">
          <h1>Sistema de Estacionamiento</h1>
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-value">{espaciosLibresNormales}</span>
              <span className="stat-label">Disponibles</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">{espaciosLibresReservados}</span>
              <span className="stat-label">Reservados</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <button
            onClick={handlePedirLugar}
            disabled={loading || espaciosLibresNormales === 0}
            className="btn-primary"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Procesando...</span>
              </>
            ) : (
              'Solicitar Lugar'
            )}
          </button>

          <button
            onClick={() => setShowEmployeeLogin(true)}
            disabled={loading || espaciosLibresReservados === 0}
            className="btn-secondary"
          >
            Soy Docente
          </button>

          <button
            disabled={true}
            className="btn-help"
          >
            Solicitar Ayuda
          </button>
        </main>
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