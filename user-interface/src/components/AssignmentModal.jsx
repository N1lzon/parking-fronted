import React, { useEffect, useState } from 'react';
import ParkingGrid from './ParkingGrid';
import './AssignmentModal.css';

const AssignmentModal = ({ espacios, numeroEspacioAsignado, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 60 segundos

  useEffect(() => {
    // Countdown timer
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
        <div className="modal-header">
          <h2>¡Espacio Asignado!</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="assigned-info">
          <div className="info-label">Tu espacio es:</div>
          <div className="info-number">{numeroEspacioAsignado}</div>
          <div className="info-text">Dirígete al espacio marcado en verde</div>
        </div>

        <div className="grid-container">
          <ParkingGrid 
            espacios={espacios} 
            espacioAsignado={numeroEspacioAsignado}
          />
        </div>

        <div className="modal-footer">
          <div className="timer">
            Esta ventana se cerrará en {timeLeft}s
          </div>
          <button onClick={onClose} className="btn-close-modal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;