import React, { useState } from 'react';

function ExpedienteSearch({ onSearch, onClear }) {
  const [filtros, setFiltros] = useState({
    numero: '',
    nombre: '',
    tipoCaso: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filtros);
  };

  const handleClear = () => {
    setFiltros({ numero: '', nombre: '', tipoCaso: '' });
    if (onClear) onClear();
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <input
              type="text"
              name="numero"
              placeholder=" Número de expediente"
              value={filtros.numero}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <input
              type="text"
              name="nombre"
              placeholder=" Nombre de persona"
              value={filtros.nombre}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <select
              name="tipoCaso"
              value={filtros.tipoCaso}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value=""> Todos los tipos</option>
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
          <button type="submit" className="search-btn"> Buscar</button>
          <button type="button" onClick={handleClear} className="clear-btn">Limpiar</button>
        </div>
      </form>
    </div>
  );
}

export default ExpedienteSearch;