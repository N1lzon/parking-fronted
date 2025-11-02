import React, { useEffect, useState } from 'react';
import './ErrorModal.css';

const ErrorModal = ({ message, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(5); // 5 segundos

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
    <div className="error-overlay">
      <div className="error-modal">
        <div className="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        
        <h3>¡Atención!</h3>
        <p>{message}</p>
        
        <button onClick={onClose} className="btn-ok">
          Entendido ({timeLeft}s)
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;