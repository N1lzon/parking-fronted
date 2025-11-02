import React, { useEffect, useState } from 'react';
import ParkingGrid from './ParkingGrid';
import './AssignmentModal.css';

const AssignmentModal = ({ espacios, numeroEspacioAsignado, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="btn-close-modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="modal-header">
          <h2>Espacio Asignado</h2>
          <div className="assigned-number">{numeroEspacioAsignado}</div>
          <p className="instruction">Dirígete al espacio marcado</p>
        </div>

        <div className="grid-section">
          <ParkingGrid 
            espacios={espacios} 
            espacioAsignado={numeroEspacioAsignado}
          />
        </div>

        <div className="modal-footer">
          <div className="timer-info">
            Cierre automático en <strong>{timeLeft}s</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;