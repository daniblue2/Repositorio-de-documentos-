import React, { useState } from 'react';

function ExpedienteSearch({ onSearch, onClear, onSearchById }) {
  const [filtros, setFiltros] = useState({
    numero: '',
    nombre: '',
    tipoCaso: '',
    estado: ''
  });
  const [buscarPorId, setBuscarPorId] = useState('');
  const [mostrarBusquedaId, setMostrarBusquedaId] = useState(false);

  const handleChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filtros);
    setMostrarBusquedaId(false);
  };

  const handleBuscarPorId = (e) => {
    e.preventDefault();
    if (buscarPorId) {
      onSearchById(parseInt(buscarPorId));
    }
    setMostrarBusquedaId(false);
  };

  const handleClear = () => {
    const filtrosVacios = { numero: '', nombre: '', tipoCaso: '', estado: '' };
    setFiltros(filtrosVacios);
    setBuscarPorId('');
    if (onClear) onClear();
    setMostrarBusquedaId(false);
  };

  return (
    <div className="search-container">
      {/* Toggle para cambiar entre búsqueda normal y por ID */}
      <div className="search-tabs">
        <button 
          className={!mostrarBusquedaId ? 'tab-active' : ''}
          onClick={() => setMostrarBusquedaId(false)}
        >
           Búsqueda general
        </button>
        <button 
          className={mostrarBusquedaId ? 'tab-active' : ''}
          onClick={() => setMostrarBusquedaId(true)}
        >
           Buscar por ID
        </button>
      </div>

      {!mostrarBusquedaId ? (
        // Búsqueda normal
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
                <option value="Niño"> Niño</option>
                <option value="Niña">Niña</option>
                <option value="Adolescente"> Adolescente</option>
                <option value="Familia">Familia</option>
                <option value="Adulto Mayor"> Adulto Mayor</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '100px' }}>
              <select
                name="estado"
                value={filtros.estado}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              >
                <option value=""> Todos</option>
                <option value="Activo">Activo</option>
                <option value="Cerrado"> Cerrado</option>
              </select>
            </div>
            <button type="submit" className="search-btn">🔍 Buscar</button>
            <button type="button" onClick={handleClear} className="clear-btn">✖ Limpiar</button>
          </div>
        </form>
      ) : (
        // Búsqueda por ID
        <form onSubmit={handleBuscarPorId}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ flex: 2 }}>
              <input
                type="number"
                placeholder="Ingresa el ID del expediente"
                value={buscarPorId}
                onChange={(e) => setBuscarPorId(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
            </div>
            <button type="submit" className="search-btn">🔍 Buscar por ID</button>
            <button type="button" onClick={handleClear} className="clear-btn">✖ Limpiar</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ExpedienteSearch;