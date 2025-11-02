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
        <div className="login-header">
          <h2>Ingreso de Empleado</h2>
          <button onClick={onCancel} className="btn-back">← Volver</button>
        </div>

        <div className="ci-display">
          <div className="ci-label">Ingrese su CI:</div>
          <div className="ci-value">{ci || '---'}</div>
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

        <div className="action-buttons">
          <button onClick={handleClear} className="btn-clear">
            Limpiar
          </button>
          <button onClick={handleDelete} className="btn-delete">
            ← Borrar
          </button>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={ci.length === 0}
          className="btn-submit"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default EmployeeLogin;