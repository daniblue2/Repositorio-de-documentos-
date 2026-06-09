import React, { useState, useEffect } from 'react';
import { expedientesAPI } from './api';
import ExpedienteForm from './ExpedienteForm';
import ExpedienteSearch from './ExpedientesSearch';
import Estadisticas from './Estadisticas';

function Dashboard({ user, onLogout }) {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      cargarExpedientes();
    }
  }, [activeTab]);

  const cargarExpedientes = async () => {
    setLoading(true);
    setBuscando(false);
    try {
      const data = await expedientesAPI.getAll();
      setExpedientes(data);
      setError('');
    } catch (err) {
      setError('Error al cargar los expedientes');
    } finally {
      setLoading(false);
    }
  };


  const buscarExpedientes = async (filtros) => {
    setLoading(true);
    try {
      const tieneFiltros = filtros.numero || filtros.nombre || filtros.tipoCaso;
      
      if (tieneFiltros) {
        const resultados = await expedientesAPI.buscar(filtros);
        setExpedientes(resultados);
        setBuscando(true);
      } else {
        await cargarExpedientes();
        setBuscando(false);
      }
      setError('');
    } catch (err) {
      setError('Error en la búsqueda');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusqueda = async () => {
    await cargarExpedientes();
  };

  const crearExpediente = async (nuevoExpediente) => {
    try {
      await expedientesAPI.create(nuevoExpediente);
      await cargarExpedientes();
      alert('Expediente creado exitosamente');
      setActiveTab('dashboard');
    } catch (err) {
      alert('Error al crear el expediente');
    }
  };

  const actualizarExpediente = async (id, data) => {
    try {
      await expedientesAPI.update(id, data);
      await cargarExpedientes();
      alert('Expediente actualizado');
      setEditingId(null);
      setEditData({});
    } catch (err) {
      alert('Error al actualizar');
    }
  };

  const eliminarExpediente = async (id) => {
    if (window.confirm('¿Eliminar este expediente?')) {
      try {
        await expedientesAPI.delete(id);
        await cargarExpedientes();
        alert('Expediente eliminado');
      } catch (err) {
        alert('Error al eliminar');
      }
    }
  };

  const startEdit = (expediente) => {
    setEditingId(expediente.id);
    setEditData(expediente);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const total = expedientes.length;
  const activos = expedientes.filter(e => e.estado === 'Activo').length;
  const cerrados = expedientes.filter(e => e.estado === 'Cerrado').length;

  if (loading && activeTab === 'dashboard') {
    return <div className="loading">Cargando expedientes...</div>;
  }

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <h1>Sistema de Gestión de Expedientes Digitales</h1>
          <div className="user-info">
            <span>Bienvenido, {user?.nombreCompleto || user?.usuario || user?.name}</span>
            <button onClick={onLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
        <nav className="nav">
          <button 
            className={activeTab === 'dashboard' ? 'nav-active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'nuevo' ? 'nav-active' : ''}
            onClick={() => setActiveTab('nuevo')}
          >
            Nuevo Expediente
          </button>
          <button 
            className={activeTab === 'estadisticas' ? 'nav-active' : ''}
            onClick={() => setActiveTab('estadisticas')}
          >
             Estadísticas
          </button>
        </nav>
      </header>

      <div className="dashboard-content">
        {error && <div className="error-banner">{error}</div>}
        
        {activeTab === 'dashboard' && (
          <>
            <ExpedienteSearch 
              onSearch={buscarExpedientes} 
              onClear={limpiarBusqueda}
            />
            
            {buscando && (
              <div className="search-info">
                Mostrando resultados de búsqueda - 
                <button onClick={limpiarBusqueda} className="clear-search-btn">
                  Mostrar todos
                </button>
              </div>
            )}
            
            <div className="stats-container">
              <div className="stat-card">
                <h3>Total Expedientes</h3>
                <div className="stat-number">{total}</div>
              </div>
              <div className="stat-card active">
                <h3>Expedientes Activos</h3>
                <div className="stat-number">{activos}</div>
              </div>
              <div className="stat-card closed">
                <h3>Expedientes Cerrados</h3>
                <div className="stat-number">{cerrados}</div>
              </div>
            </div>

            <div className="table-container">
              <h2>Lista de Expedientes</h2>
              <table className="expedientes-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Número</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {expedientes.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                        No hay expedientes que coincidan con la búsqueda
                       </td>
                    </tr>
                  ) : (
                    expedientes.map((exp) => (
                      <tr key={exp.id}>
                        {editingId === exp.id ? (
                          <>
                              <td>{exp.id}</td>
                              <td><input name="numeroExpediente" value={editData.numeroExpediente} onChange={(e) => setEditData({...editData, numeroExpediente: e.target.value})} /></td>
                              <td><input name="nombrePersona" value={editData.nombrePersona} onChange={(e) => setEditData({...editData, nombrePersona: e.target.value})} /></td>
                              <td>
                               <select name="tipoCaso" value={editData.tipoCaso} onChange={(e) => setEditData({...editData, tipoCaso: e.target.value})}>
                                 <option>Civil</option>
                                 <option>Penal</option>
                                 <option>Familiar</option>
                                 <option>Laboral</option>
                                 <option>Niño</option>
                                 <option>Niña</option>
                                 <option>Adolescente</option>
                                 <option>Adulto Mayor</option>
                               </select>
                              </td>
                              <td>
                               <textarea 
                                 name="descripcion" 
                                 value={editData.descripcion || ''} 
                                 onChange={(e) => setEditData({...editData, descripcion: e.target.value})}
                                 rows="2"
                                 style={{ width: '150px', padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                               />
                              </td>
                              <td>{new Date(exp.fechaRegistro).toLocaleDateString()}</td>
                              <td>
                               <select name="estado" value={editData.estado} onChange={(e) => setEditData({...editData, estado: e.target.value})}>
                                 <option>Activo</option>
                                 <option>Cerrado</option>
                               </select>
                              </td>
                              <td>
                               <button onClick={() => actualizarExpediente(exp.id, editData)} className="save-btn"> Guardar</button>
                               <button onClick={cancelEdit} className="cancel-btn">Cancelar</button>
                              </td>
                          </>
                        ) : (
                          <>
                              <td>{exp.id}</td>
                              <td>{exp.numeroExpediente}</td>
                              <td>{exp.nombrePersona}</td>
                              <td>{exp.tipoCaso}</td>
                             <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>{exp.descripcion || '—'}</td>
                              <td>{new Date(exp.fechaRegistro).toLocaleDateString()}</td>
                              <td>
                               <span className={`status-badge ${exp.estado === 'Activo' ? 'status-active' : 'status-closed'}`}>
                                 {exp.estado || 'Activo'}
                               </span>
                              </td>
                              <td>
                               <button onClick={() => startEdit(exp)} className="edit-btn"> Editar</button>
                               <button onClick={() => eliminarExpediente(exp.id)} className="delete-btn">Eliminar</button>
                              </td>
                          </>
                        )}
                       </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        
        {activeTab === 'nuevo' && (
          <ExpedienteForm 
            onSubmit={crearExpediente}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'estadisticas' && (
          <Estadisticas />
        )}
      </div>
    </div>
  );
}

export default Dashboard;