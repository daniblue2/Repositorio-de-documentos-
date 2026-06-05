import React, { useState } from 'react';

function ExpedienteForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    numeroExpediente: '',
    nombrePersona: '',
    tipoCaso: 'Niño',
    descripcion: '',
    fechaRegistro: new Date().toISOString().split('T')[0],
    estado: 'Activo'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <h2>Nuevo Expediente</h2>
      <form onSubmit={handleSubmit} className="expediente-form">
        <div className="form-group">
          <label>Número de expediente *</label>
          <input
            type="text"
            name="numeroExpediente"
            value={formData.numeroExpediente}
            onChange={handleChange}
            placeholder="Ej: EXP-2024-001"
            required
          />
        </div>

        <div className="form-group">
          <label>Nombre de la persona *</label>
          <input
            type="text"
            name="nombrePersona"
            value={formData.nombrePersona}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo de caso *</label>
          <select
            name="tipoCaso"
            value={formData.tipoCaso}
            onChange={handleChange}
            required
          >
            <option value="Niño">Niño</option>
            <option value="Niña">Niña</option>
            <option value="Adolescente">Adolescente</option>
            <option value="Familia">Familia</option>
            <option value="Adulto Mayor">Adulto Mayor</option>
          </select>
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            placeholder="Descripción del caso..."
          />
        </div>

        <div className="form-group">
          <label>Estado *</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="Activo">Activo</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            Guardar Expediente
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpedienteForm;