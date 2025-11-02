import React from 'react';
import './ParkingGrid.css';

const ParkingGrid = ({ espacios, espacioAsignado }) => {
  const getEstadoClass = (espacio) => {
    // Si es el espacio asignado, resaltarlo en verde
    if (espacioAsignado && espacio.numero_de_espacio === espacioAsignado) {
      return 'asignado';
    }
    
    // Mostrar estado actual
    if (espacio.estado === 'ocupado') {
      return 'ocupado';
    }
    
    if (espacio.reservado === 'si') {
      return 'reservado';
    }
    
    return 'libre';
  };

  return (
    <div className="parking-grid">
      {espacios.map((espacio) => (
        <div
          key={espacio.id}
          className={`parking-space ${getEstadoClass(espacio)}`}
        >
          <div className="space-number">{espacio.numero_de_espacio}</div>
        </div>
      ))}
    </div>
  );
};

export default ParkingGrid;