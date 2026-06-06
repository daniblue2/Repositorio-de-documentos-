import React, { useState, useEffect, useRef } from 'react';
import { estadisticasAPI } from './api';
import './Estadisticas.css';

function Estadisticas() {
  const [resumen, setResumen] = useState(null);
  const [casosPorMes, setCasosPorMes] = useState([]);
  const [casosPorEdad, setCasosPorEdad] = useState([]);
  const [casosPorGenero, setCasosPorGenero] = useState([]);
  const [gruposVulnerables, setGruposVulnerables] = useState([]);
  const [estadisticasMes, setEstadisticasMes] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);
  const [tipoVista, setTipoVista] = useState('anual'); // 'anual' o 'mensual'
  const [error, setError] = useState(null);
  
  const pdfContentRef = useRef(null);

  const meses = [
    { value: 1, nombre: 'Enero' },
    { value: 2, nombre: 'Febrero' },
    { value: 3, nombre: 'Marzo' },
    { value: 4, nombre: 'Abril' },
    { value: 5, nombre: 'Mayo' },
    { value: 6, nombre: 'Junio' },
    { value: 7, nombre: 'Julio' },
    { value: 8, nombre: 'Agosto' },
    { value: 9, nombre: 'Septiembre' },
    { value: 10, nombre: 'Octubre' },
    { value: 11, nombre: 'Noviembre' },
    { value: 12, nombre: 'Diciembre' }
  ];

  useEffect(() => {
    cargarTodasLasEstadisticas();
  }, []);

  useEffect(() => {
    if (tipoVista === 'mensual') {
      cargarEstadisticasPorMes();
    } else {
      cargarDatosAnuales();
    }
  }, [tipoVista, añoSeleccionado, mesSeleccionado]);

  const cargarTodasLasEstadisticas = async () => {
    setCargando(true);
    setError(null);
    try {
      await cargarDatosAnuales();
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
      setError('Error al cargar las estadísticas');
    } finally {
      setCargando(false);
    }
  };

  const cargarDatosAnuales = async () => {
    const [resumenData, porEdadData, porGeneroData, gruposData, porMesData] = await Promise.all([
      estadisticasAPI.getResumen(),
      estadisticasAPI.getPorEdad(),
      estadisticasAPI.getPorGenero(),
      estadisticasAPI.getGruposVulnerables(),
      estadisticasAPI.getPorMes(añoSeleccionado)
    ]);
    setResumen(resumenData);
    setCasosPorEdad(porEdadData);
    setCasosPorGenero(porGeneroData);
    setGruposVulnerables(gruposData);
    setCasosPorMes(porMesData);
  };

  const cargarEstadisticasPorMes = async () => {
    const data = await estadisticasAPI.getPorMesEspecifico(mesSeleccionado, añoSeleccionado);
    setEstadisticasMes(data);
  };

  const handleExportarPDF = async () => {
    if (!pdfContentRef.current) {
      alert('No se pudo generar el PDF');
      return;
    }

    const loadingDiv = document.createElement('div');
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '0';
    loadingDiv.style.left = '0';
    loadingDiv.style.width = '100%';
    loadingDiv.style.height = '100%';
    loadingDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
    loadingDiv.style.color = 'white';
    loadingDiv.style.display = 'flex';
    loadingDiv.style.alignItems = 'center';
    loadingDiv.style.justifyContent = 'center';
    loadingDiv.style.zIndex = '9999';
    loadingDiv.innerHTML = '<div style="text-align:center"><div style="font-size:50px">📄</div><div>Generando PDF...</div></div>';
    document.body.appendChild(loadingDiv);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      const canvas = await html2canvas(pdfContentRef.current, {
        scale: 2.5,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`estadisticas_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el PDF: ' + error.message);
    } finally {
      document.body.removeChild(loadingDiv);
    }
  };

  if (cargando) {
    return <div className="loading"> Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="error"> {error}</div>;
  }

  const mesActual = meses.find(m => m.value === mesSeleccionado)?.nombre;

  return (
    <div className="estadisticas-wrapper">
      <div className="estadisticas-header">
        <h1> Panel de Estadísticas</h1>
        <div className="header-controls">
          {/* Selector de tipo de vista */}
          <div className="selector-wrapper">
            <label>Ver:</label>
            <select value={tipoVista} onChange={(e) => setTipoVista(e.target.value)} className="selector-año">
              <option value="anual">📅 Estadísticas Anuales</option>
              <option value="mensual">📆 Estadísticas por Mes</option>
            </select>
          </div>

          {/* Selector de año */}
          <div className="selector-wrapper">
            <label>Año:</label>
            <select value={añoSeleccionado} onChange={(e) => setAñoSeleccionado(parseInt(e.target.value))} className="selector-año">
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>

          {/* Selector de mes (solo si es vista mensual) */}
          {tipoVista === 'mensual' && (
            <div className="selector-wrapper">
              <label>Mes:</label>
              <select value={mesSeleccionado} onChange={(e) => setMesSeleccionado(parseInt(e.target.value))} className="selector-año">
                {meses.map(mes => (
                  <option key={mes.value} value={mes.value}>{mes.nombre}</option>
                ))}
              </select>
            </div>
          )}

          <button onClick={handleExportarPDF} className="btn-pdf">
            📄 Exportar a PDF
          </button>
        </div>
      </div>

      {/* Contenido del PDF */}
      <div className="estadisticas-container" ref={pdfContentRef}>
        <div className="reporte-header">
          <h1>Sistema de Gestión de Expedientes</h1>
          <h2>
            Reporte de Estadísticas - {tipoVista === 'anual' ? `Año ${añoSeleccionado}` : `${mesActual} ${añoSeleccionado}`}
          </h2>
          <div className="fecha-generacion">
            Generado: {new Date().toLocaleString()}
          </div>
        </div>

        {tipoVista === 'anual' ? (
          // ========== VISTA ANUAL ==========
          <>
            <div className="tarjetas-resumen">
              <div className="tarjeta"><h3> Total Expedientes</h3><p className="numero">{resumen?.totalExpedientes || 0}</p></div>
              <div className="tarjeta"><h3> Casos este mes</h3><p className="numero">{resumen?.casosEsteMes || 0}</p></div>
              <div className="tarjeta"><h3> Casos este año</h3><p className="numero">{resumen?.casosEsteAño || 0}</p></div>
              <div className="tarjeta"><h3> Niños/Adolescentes</h3><p className="numero">{resumen?.menoresEdad || 0}</p></div>
              <div className="tarjeta"><h3> Adultos Mayores</h3><p className="numero">{resumen?.adultosMayores || 0}</p></div>
            </div>

            <div className="tabla-container">
              <h2> Casos por Mes - {añoSeleccionado}</h2>
              <table className="tabla-estadisticas">
                <thead><tr><th>Mes</th><th>Cantidad</th></tr></thead>
                <tbody>
                  {casosPorMes.map(mes => (
                    <tr key={mes.numeroMes}><td><strong>{mes.mes}</strong></td><td style={{textAlign:'center', fontWeight:'bold', color:'#3498db'}}>{mes.cantidad}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          // ========== VISTA MENSUAL ==========
          <>
            <div className="tarjetas-resumen">
              <div className="tarjeta"><h3> Casos en {mesActual}</h3><p className="numero">{estadisticasMes?.totalCasos || 0}</p></div>
              <div className="tarjeta"><h3> Casos Activos</h3><p className="numero">{estadisticasMes?.casosActivos || 0}</p></div>
              <div className="tarjeta"><h3> Niños/Adolescentes</h3><p className="numero">{estadisticasMes?.menoresEdad || 0}</p></div>
              <div className="tarjeta"><h3> Adultos Mayores</h3><p className="numero">{estadisticasMes?.adultosMayores || 0}</p></div>
            </div>
          </>
        )}

        {/* Tablas comunes para ambas vistas */}
        <div className="dos-columnas">
          <div className="tabla-container">
            <h2> Distribución por Edad</h2>
            <table className="tabla-estadisticas">
              <thead><tr><th>Rango</th><th>Cantidad</th><th>%</th></tr></thead>
              <tbody>
                {casosPorEdad.map(rango => (
                  <tr key={rango.rangoEdad}>
                    <td>{rango.rangoEdad}</td>
                    <td style={{textAlign:'center'}}>{rango.cantidad}</td>
                    <td style={{textAlign:'center'}}><span className="badge-azul">{rango.porcentaje}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tabla-container">
            <h2> Distribución por Género</h2>
            <table className="tabla-estadisticas">
              <thead><tr><th>Género</th><th>Cantidad</th><th>%</th></tr></thead>
              <tbody>
                {casosPorGenero.map(genero => (
                  <tr key={genero.genero}>
                    <td>{genero.genero}</td>
                    <td style={{textAlign:'center'}}>{genero.cantidad}</td>
                    <td style={{textAlign:'center'}}><span className="badge-verde">{genero.porcentaje}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="tabla-container">
          <h2> Grupos Prioritarios</h2>
          <table className="tabla-estadisticas">
            <thead><tr><th>Grupo</th><th>Cantidad</th></tr></thead>
            <tbody>
              {gruposVulnerables.map(grupo => (
                <tr key={grupo.grupo}><td>{grupo.grupo}</td><td style={{textAlign:'center', fontWeight:'bold', color:'#e74c3c'}}>{grupo.cantidad}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pie-pagina">
          Sistema de Gestión de Expedientes - Procuraduría de Protección
        </div>
      </div>
    </div>
  );
}

export default Estadisticas;