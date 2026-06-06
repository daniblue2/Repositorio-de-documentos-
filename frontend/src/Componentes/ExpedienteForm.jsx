import React, { useState } from 'react';

function ExpedienteForm({ expediente, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    numeroExpediente: expediente?.numeroExpediente || '',
    nombrePersona: expediente?.nombrePersona || '',
    tipoCaso: expediente?.tipoCaso || '',
    descripcion: expediente?.descripcion || '',
    fechaNacimiento: expediente?.fechaNacimiento || '',
    genero: expediente?.genero || ''
  });
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Calcular edad automáticamente desde la fecha de nacimiento
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const edadCalculada = calcularEdad(formData.fechaNacimiento);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="formulario-container">
      <h2>{expediente ? ' Editar Expediente' : ' Nuevo Expediente'}</h2>
      <form onSubmit={handleSubmit} className="expediente-form">
        
        <div className="form-group">
          <label>Número de Expediente *</label>
          <input
            type="text"
            name="numeroExpediente"
            value={formData.numeroExpediente}
            onChange={handleChange}
            required
            placeholder="Ej: EXP-001"
          />
        </div>

        <div className="form-group">
          <label>Nombre de la Persona *</label>
          <input
            type="text"
            name="nombrePersona"
            value={formData.nombrePersona}
            onChange={handleChange}
            required
            placeholder="Nombre completo"
          />
        </div>

        <div className="form-group">
          <label>Tipo de Caso *</label>
          <select
            name="tipoCaso"
            value={formData.tipoCaso}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Civil">Civil</option>
            <option value="Penal">Penal</option>
            <option value="Familiar">Familiar</option>
            <option value="Laboral">Laboral</option>
            <option value="Niño">Niño</option>
            <option value="Niña">Niña</option>
            <option value="Adolescente">Adolescente</option>
            <option value="Adulto Mayor">Adulto Mayor</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {edadCalculada && (
              <small className="edad-indicador">
                📅 Edad: {edadCalculada} años
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Género</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
            >
              <option value="">Seleccionar...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="3"
            placeholder="Detalles del caso..."
          />
        </div>

        <div className="form-buttons">
          <button type="submit" disabled={guardando} className="btn-guardar">
            {guardando ? 'Guardando...' : ' Guardar'}
          </button>
          <button type="button" onClick={onCancel} className="btn-cancelar">
             Cancelar
          </button>
        </div>
      </form>

      {/* Resumen informativo para el usuario */}
      <div className="info-adicional">
        <h4>ℹ️ Sobre los grupos de edad:</h4>
        <ul>
          <li><strong>Niño/Niña:</strong> 0 a 12 años</li>
          <li><strong>Adolescente:</strong> 13 a 17 años</li>
          <li><strong>Adulto:</strong> 18 a 59 años</li>
          <li><strong>Adulto Mayor:</strong> 60 años o más</li>
        </ul>
      </div>
    </div>
  );
}

export default ExpedienteForm;