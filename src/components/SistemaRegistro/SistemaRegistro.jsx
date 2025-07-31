import React from 'react';
import './SistemaRegistro.css';
import imagenFondo from '../../assets/moto-noche.jpg'; // <-- IMPORTANTE: Guarda tu imagen en una carpeta 'assets'

const SistemaRegistro = ({ children }) => {
  return (
    <div className="registro-container">
      {/* ===== PANEL IZQUIERDO (IMAGEN) ===== */}
      <div className="panel panel-izquierdo" style={{ backgroundImage: `url(${imagenFondo})` }}>
       {/* ===== <header className="panel-header">
          <button className="btn btn-login">LOGIN</button>
          <button className="btn btn-register-active">REGISTER</button>
        </header>===== */}
      
      </div>

      {/* ===== PANEL DERECHO (FORMULARIO) ===== */}
      <div className="panel panel-derecho">
        <div className="formulario-wrapper">
          {/* 
            Aquí es donde se insertará el formulario que me pasarás después.
            Usamos 'children' como un marcador de posición dinámico.
            Por ahora, mostrará el título y un mensaje.
          */}
        
          
          {children} 
          
        </div>
      </div>
    </div>
  );
};

export default SistemaRegistro;