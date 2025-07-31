import React from 'react';
import SistemaRegistro from './components/SistemaRegistro/SistemaRegistro';
import FormularioRegistro from './components/FormularioRegistro/FormularioRegistro'; // <-- 1. Importa el nuevo componente
import './App.css'; 

function App() {
  return (
    <div className="App">
      <SistemaRegistro>
        {/* 2. Reemplaza el placeholder con el nuevo formulario */}
        <FormularioRegistro />
      </SistemaRegistro>
    </div>
  );
}

export default App;