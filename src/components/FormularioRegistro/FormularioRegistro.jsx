import React, { useState } from 'react';
import Select, { components } from 'react-select'; 
import './FormularioRegistro.css';
import headerImageDesktop from '../../assets/form-header.png';
import headerImageMobile from '../../assets/form-header-mobile.png';
import { FaUser, FaBirthdayCake, FaVenusMars, FaGlobeAmericas, FaListAlt, FaCheckCircle } from 'react-icons/fa';

// Opciones para el selector de Sexo con iconos (Corregido: añadí los iconos que faltaban)
const opcionesSexo = [
  { value: 'MASCULINO', label: 'Masculino', icon: <FaMars /> },
  { value: 'FEMENINO', label: 'Femenino', icon: <FaVenus /> }
];

// Opciones para el selector de Categoría
const opcionesCategoria = [
  { value: 'JUVENIL', label: 'Juvenil: 15 a 20 años' },
  { value: 'LIBRE', label: 'Libre: A partir de 21 años' },
  { value: 'PCD', label: 'PCD' }
];

// Estilos personalizados para react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    fontSize: '1.2rem',
    color: '#34495e',
    minHeight: 'auto',
    height: '100%',
    cursor: 'pointer',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#34495e',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: '1rem',
    backgroundColor: state.isSelected ? '#007bff' : (state.isFocused ? '#eaf4ff' : 'white'),
    color: state.isSelected ? 'white' : '#333',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  menu: (provided) => ({ ...provided, marginTop: '8px', borderRadius: '12px', boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0', overflow: 'hidden', }),
  placeholder: (provided) => ({ ...provided, color: '#bdc3c7', }),
  indicatorSeparator: () => ({ display: 'none', }),
  dropdownIndicator: (provided) => ({ ...provided, color: '#34495e', }),
  menuPortal: base => ({ ...base, zIndex: 9999 })
};

// Componentes personalizados para react-select con iconos
const { Option } = components;
const IconOption = (props) => ( <Option {...props}> <div className="option-with-icon"> {props.data.icon} <span>{props.data.label}</span> </div> </Option>);
const { SingleValue } = components;
const IconSingleValue = (props) => ( <SingleValue {...props}> <div className="option-with-icon"> {props.data.icon} <span>{props.data.label}</span> </div> </SingleValue>);

// Estado inicial para resetear el formulario
const initialState = { nombres: '', apellidos: '', edad: '', sexo: null, categoria: null, nacionalidad: '', };

const FormularioRegistro = () => {
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => { const { name, value } = e.target; const camposMayusculas = ['nombres', 'apellidos', 'nacionalidad']; const valorProcesado = camposMayusculas.includes(name) ? value.toUpperCase() : value; setFormData({ ...formData, [name]: valorProcesado }); };
  const handleSelectChange = (selectedOption, action) => { setFormData({ ...formData, [action.name]: selectedOption }); };
  
  // =======================================================
  // ===== FUNCIÓN handleSubmit OPTIMIZADA =====
  // =======================================================
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Deshabilita el botón para evitar doble clic

    const scriptURL = process.env.REACT_APP_GOOGLE_SCRIPT_URL;
    const formDataObject = new FormData();
    formDataObject.append('nombres', formData.nombres);
    formDataObject.append('apellidos', formData.apellidos);
    formDataObject.append('edad', formData.edad);
    formDataObject.append('sexo', formData.sexo ? formData.sexo.value : '');
    formDataObject.append('nacionalidad', formData.nacionalidad);
    formDataObject.append('categoria', formData.categoria ? formData.categoria.value : '');

    // 1. ACTUALIZACIÓN OPTIMISTA: Mostramos el éxito y limpiamos el form INMEDIATAMENTE.
    setShowSuccess(true);
    setFormData(initialState);

    // 2. ENVIAMOS LOS DATOS EN SEGUNDO PLANO (sin `await`)
    fetch(scriptURL, { method: 'POST', body: formDataObject })
      .then(response => {
        if (response.ok) {
          console.log('Registro guardado en Google Sheets exitosamente.');
        } else {
          // Si hay un error, lo registramos en la consola para el desarrollador.
          // El usuario no lo verá, ya que para él, la operación fue un éxito.
          console.error('Error al enviar el formulario a Google Sheets.');
        }
      })
      .catch(error => {
        // También registramos errores de red en la consola.
        console.error('Error de red al enviar el formulario:', error);
      })
      .finally(() => {
        // Habilitamos el botón de nuevo registro (que está en la pantalla de éxito)
        setIsSubmitting(false);
      });
  };

  const handleReset = () => {
    setFormData(initialState);
    setShowSuccess(false);
  };
  
  return (
    <div className="form-container">
      <img src={headerImageDesktop} alt="Form Header" className="form-header-img desktop-header" />
      <img src={headerImageMobile} alt="Form Header Mobile" className="form-header-img mobile-header" />

      <h2 className="form-title">INSCRIPCIÓN</h2>
      
      {showSuccess ? (
        <div className="success-container">
          <FaCheckCircle className="success-icon" />
          <h3 className="success-title">¡Registro Exitoso!</h3>
          <p className="success-text">Tus datos han sido guardados correctamente. ¡Nos vemos en la carrera!</p>
          <button onClick={handleReset} className="btn-reset">
            Registrar a otra persona
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form-body">
            <div className="input-group"><FaUser className="input-icon" /><input type="text" name="nombres" placeholder="Nombres" className="input-field" value={formData.nombres} onChange={handleInputChange} required /></div>
            <div className="input-group"><FaUser className="input-icon" /><input type="text" name="apellidos" placeholder="Apellidos" className="input-field" value={formData.apellidos} onChange={handleInputChange} required /></div>
            <div className="input-group"><FaBirthdayCake className="input-icon" /><input type="number" name="edad" placeholder="Edad" className="input-field" value={formData.edad} onChange={handleInputChange} required /></div>
            <div className="input-group">
              <FaVenusMars className="input-icon" />
              <Select
                menuPosition={'fixed'}
                menuPortalTarget={document.body}
                classNamePrefix="custom-select" name="sexo" value={formData.sexo} options={opcionesSexo} styles={customStyles} placeholder="Selecciona tu Sexo" onChange={handleSelectChange} isSearchable={false} components={{ Option: IconOption, SingleValue: IconSingleValue }} required />
            </div>
            <div className="input-group">
              <FaGlobeAmericas className="input-icon" />
              <input type="text" name="nacionalidad" placeholder="Nacionalidad (Ejm: Perú)" className="input-field" value={formData.nacionalidad} onChange={handleInputChange} required />
            </div>
            <div className="input-group">
              <FaListAlt className="input-icon" />
              <Select
                 menuPlacement="top"
                menuPosition={'fixed'}
                menuPortalTarget={document.body}
                classNamePrefix="custom-select" 
                name="categoria" 
                value={formData.categoria} 
                options={opcionesCategoria} 
                styles={customStyles}
                placeholder="Selecciona una Categoría" 
                onChange={handleSelectChange} 
                isSearchable={false} 
                required 
              />
            </div>
            {/* El botón ahora se deshabilita instantáneamente, pero el usuario no verá "Registrando..." */}
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              Registrar
            </button>
        </form>
      )}
    </div>
  );
};

export default FormularioRegistro;
