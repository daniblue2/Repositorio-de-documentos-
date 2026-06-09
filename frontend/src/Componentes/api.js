const API_URL = 'http://localhost:5186/api';

// ========== FUNCIONES DE AUTENTICACIÓN ==========
const getToken = () => localStorage.getItem('token');

const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }
  
  return response;
};

// API DE AUTENTICACIÓN 
export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Credenciales inválidas');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => !!getToken()
};

//  API DE EXPEDIENTES 
export const expedientesAPI = {
  getAll: async () => {
    const response = await fetchWithAuth(`${API_URL}/ExpedientesDapper`);
    if (!response.ok) throw new Error('Error al cargar expedientes');
    return await response.json();
  },
  
  getById: async (id) => {
    const response = await fetchWithAuth(`${API_URL}/ExpedientesDapper/${id}`);
    if (!response.ok) throw new Error('Expediente no encontrado');
    return await response.json();
  },
  
  buscar: async (filtros) => {
    const params = new URLSearchParams();
    if (filtros.numero && filtros.numero.trim()) params.append('numero', filtros.numero.trim());
    if (filtros.nombre && filtros.nombre.trim()) params.append('nombre', filtros.nombre.trim());
    if (filtros.tipoCaso && filtros.tipoCaso) params.append('tipoCaso', filtros.tipoCaso);
    
    const response = await fetchWithAuth(`${API_URL}/ExpedientesDapper/buscar?${params.toString()}`);
    if (!response.ok) throw new Error('Error en la búsqueda');
    return await response.json();
  },
  
  create: async (expediente) => {
    const response = await fetchWithAuth(`${API_URL}/ExpedientesDapper`, {
      method: 'POST',
      body: JSON.stringify(expediente)
    });
    if (!response.ok) throw new Error('Error al crear expediente');
    return await response.json();
  },
  
  update: async (id, expediente) => {
    const response = await fetchWithAuth(`${API_URL}/ExpedientesDapper/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expediente)
    });
    if (!response.ok) throw new Error('Error al actualizar expediente');
    return await response.json();
  },
  
  delete: async (id) => {
    const response = await fetchWithAuth(`${API_URL}/ExpedientesDapper/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar expediente');
    return true;
  }
};

//  API DE ESTADÍSTICAS 
export const estadisticasAPI = {
  getResumen: async () => {
    const response = await fetchWithAuth(`${API_URL}/ExpedientesDapper/estadisticas/resumen`);
    return await response.json();
  },
  
  getPorMes: async (año) => {
    const url = año ? `${API_URL}/ExpedientesDapper/estadisticas/por-mes?año=${año}` 
                    : `${API_URL}/ExpedientesDapper/estadisticas/por-mes`;
    const response = await fetchWithAuth(url);
    return await response.json();
  },
  
  getPorEdad: async () => {
    const response = await fetchWithAuth(`${API_URL}/ExpedientesDapper/estadisticas/por-edad`);
    return await response.json();
  },
  
  getPorGenero: async () => {
    const response = await fetchWithAuth(`${API_URL}/ExpedientesDapper/estadisticas/por-genero`);
    return await response.json();
  },
  
  getGruposVulnerables: async () => {
    const response = await fetchWithAuth(`${API_URL}/ExpedientesDapper/estadisticas/grupos-vulnerables`);
    return await response.json();
  },

  getPorMesEspecifico: async (mes, año) => {
    const response = await fetchWithAuth(`${API_URL}/ExpedientesDapper/estadisticas/por-mes-especifico?mes=${mes}&año=${año}`);
    return await response.json();
  }
};