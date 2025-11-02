import React, { useState } from 'react';
import './EmployeeLogin.css';

const EmployeeLogin = ({ onSubmit, onCancel }) => {
  const [ci, setCi] = useState('');

  const handleNumberClick = (num) => {
    setCi(prev => prev + num);
  };

  const handleDelete = () => {
    setCi(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setCi('');
  };

  const handleSubmit = () => {
    if (ci.length > 0) {
      onSubmit(parseInt(ci));
    }
  };

  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', '#'];

  return (
    <div className="employee-login-overlay">
      <div className="employee-login-modal">
        <button onClick={onCancel} className="btn-back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        <div className="login-content">
          <h2>Ingreso Docente</h2>

          <div className="ci-display">
            <div className="ci-label">Ingrese su CI</div>
            <div className="ci-value">{ci || 'CI...'}</div>
          </div>

          <div className="numpad">
            {buttons.map((btn) => (
              <button
                key={btn}
                onClick={() => handleNumberClick(btn)}
                className="numpad-btn"
              >
                {btn}
              </button>
            ))}
          </div>

          <div className="action-row">
            <button onClick={handleDelete} className="btn-delete">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"/>
                <line x1="18" y1="9" x2="12" y2="15"/>
                <line x1="12" y1="9" x2="18" y2="15"/>
              </svg>
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={ci.length === 0}
              className="btn-submit"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;