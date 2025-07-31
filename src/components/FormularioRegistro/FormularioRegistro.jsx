import React, { useState } from 'react';
import Select, { components } from 'react-select'; 
import './FormularioRegistro.css';
// 1. Importamos AMBAS imágenes de cabecera
import headerImageDesktop from '../../assets/form-header.png';
import headerImageMobile from '../../assets/form-header-mobile.png'; // Asegúrate de haber guardado esta imagen
// 2. Importamos todos los iconos necesarios
import { FaUser, FaBirthdayCake, FaVenusMars, FaGlobeAmericas, FaListAlt, FaMars, FaVenus, FaCheckCircle } from 'react-icons/fa';

// Opciones para el selector de Sexo con iconos
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
    fontSize: '1.3rem',
    color: '#34495e',
    minHeight: 'auto',
    height: '100%',
    cursor: 'pointer',
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: '8px',
    borderRadius: '12px',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e0e0e0',
    overflow: 'hidden',
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: '1.2rem',
    backgroundColor: state.isSelected ? '#007bff' : (state.isFocused ? '#eaf4ff' : 'white'),
    color: state.isSelected ? 'white' : '#333',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#34495e',
    display: 'flex',
    alignItems: 'center',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#bdc3c7',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#34495e',
  }),
};

// Componente personalizado para renderizar las opciones con icono
const { Option } = components;
const IconOption = (props) => (
  <Option {...props}>
    <div className="option-with-icon">
      {props.data.icon}
      <span>{props.data.label}</span>
    </div>
  </Option>
);

// Componente personalizado para renderizar el valor seleccionado con icono
const { SingleValue } = components;
const IconSingleValue = (props) => (
  <SingleValue {...props}>
    <div className="option-with-icon">
      {props.data.icon}
      <span>{props.data.label}</span>
    </div>
  </SingleValue>
);

// Objeto con el estado inicial del formulario para poder resetearlo fácilmente
const initialState = {
  nombres: '',
  apellidos: '',
  edad: '',
  sexo: null,
  categoria: null,
  nacionalidad: '',
};

const FormularioRegistro = () => {
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const camposMayusculas = ['nombres', 'apellidos', 'nacionalidad'];
    const valorProcesado = camposMayusculas.includes(name) ? value.toUpperCase() : value;
    setFormData({ ...formData, [name]: valorProcesado });
  };

  const handleSelectChange = (selectedOption, action) => {
    setFormData({ ...formData, [action.name]: selectedOption });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const scriptURL = process.env.REACT_APP_GOOGLE_SCRIPT_URL;
    const formDataObject = new FormData();
    formDataObject.append('nombres', formData.nombres);
    formDataObject.append('apellidos', formData.apellidos);
    formDataObject.append('edad', formData.edad);
    formDataObject.append('sexo', formData.sexo ? formData.sexo.value : '');
    formDataObject.append('nacionalidad', formData.nacionalidad);
    formDataObject.append('categoria', formData.categoria ? formData.categoria.value : '');

    try {
      const response = await fetch(scriptURL, { method: 'POST', body: formDataObject });
      if (response.ok) {
        setShowSuccess(true); 
      } else {
         throw new Error('Falló la respuesta del servidor.');
      }
    } catch (error) {
      console.error('Error!', error.message);
      alert('Error al guardar el registro. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialState);
    setShowSuccess(false);
  };

  return (
    <div className="form-container">
      {/* 3. Renderizamos AMBAS imágenes con sus clases respectivas */}
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
            <div className="input-group">
              <FaUser className="input-icon" />
              <input type="text" name="nombres" placeholder="Nombres" className="input-field" value={formData.nombres} onChange={handleInputChange} required />
            </div>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input type="text" name="apellidos" placeholder="Apellidos" className="input-field" value={formData.apellidos} onChange={handleInputChange} required />
            </div>
            <div className="input-group">
              <FaBirthdayCake className="input-icon" />
              <input type="number" name="edad" placeholder="Edad" className="input-field" value={formData.edad} onChange={handleInputChange} required />
            </div>
            <div className="input-group">
              <FaVenusMars className="input-icon" />
              <Select classNamePrefix="custom-select" name="sexo" value={formData.sexo} options={opcionesSexo} styles={customStyles} placeholder="Selecciona tu Sexo" onChange={handleSelectChange} isSearchable={false} components={{ Option: IconOption, SingleValue: IconSingleValue }} required />
            </div>
            <div className="input-group">
              <FaGlobeAmericas className="input-icon" />
              <input type="text" name="nacionalidad" placeholder="Nacionalidad (Ejm: Perú)" className="input-field" value={formData.nacionalidad} onChange={handleInputChange} required />
            </div>
            <div className="input-group">
              <FaListAlt className="input-icon" />
              <Select classNamePrefix="custom-select" name="categoria" value={formData.categoria} options={opcionesCategoria} styles={customStyles} placeholder="Selecciona una Categoría" onChange={handleSelectChange} isSearchable={false} required />
            </div>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Registrar'}
            </button>
        </form>
      )}
    </div>
  );
};

export default FormularioRegistro;
