// Sistema de almacenamiento local para el inventario
export interface Equipo {
  id: string
  numero_serie: string
  tipo_equipo: string
  marca: string
  modelo: string
  estado: 'Activo' | 'Mantenimiento' | 'Dañado' | 'Retirado'
  ubicacion: string
  unidad: string
  fecha_ingreso: string
  fecha_ultima_revision?: string
  responsable: string
  observaciones?: string
  created_at: string
  updated_at: string
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: 'admin' | 'usuario'
  created_at: string
}

export interface Reporte {
  id: string
  titulo: string
  tipo_reporte: string
  filtros: any
  datos: Equipo[]
  created_at: string
}

// Funciones de almacenamiento local
export const storage = {
  // Equipos
  getEquipos: (): Equipo[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('inventario_equipos')
    return data ? JSON.parse(data) : []
  },

  saveEquipos: (equipos: Equipo[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('inventario_equipos', JSON.stringify(equipos))
  },

  addEquipo: (equipo: Omit<Equipo, 'id' | 'created_at' | 'updated_at'>): Equipo => {
    const equipos = storage.getEquipos()
    const newEquipo: Equipo = {
      ...equipo,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    equipos.push(newEquipo)
    storage.saveEquipos(equipos)
    return newEquipo
  },

  updateEquipo: (id: string, updates: Partial<Equipo>): Equipo | null => {
    const equipos = storage.getEquipos()
    const index = equipos.findIndex(e => e.id === id)
    if (index === -1) return null
    
    equipos[index] = {
      ...equipos[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    storage.saveEquipos(equipos)
    return equipos[index]
  },

  deleteEquipo: (id: string): boolean => {
    const equipos = storage.getEquipos()
    const filtered = equipos.filter(e => e.id !== id)
    if (filtered.length === equipos.length) return false
    
    storage.saveEquipos(filtered)
    return true
  },

  // Usuarios
  getUsuarios: (): Usuario[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('inventario_usuarios')
    return data ? JSON.parse(data) : []
  },

  saveUsuarios: (usuarios: Usuario[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('inventario_usuarios', JSON.stringify(usuarios))
  },

  getCurrentUser: (): Usuario | null => {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem('inventario_current_user')
    return data ? JSON.parse(data) : null
  },

  setCurrentUser: (usuario: Usuario): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('inventario_current_user', JSON.stringify(usuario))
  },

  // Reportes
  getReportes: (): Reporte[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('inventario_reportes')
    return data ? JSON.parse(data) : []
  },

  saveReportes: (reportes: Reporte[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('inventario_reportes', JSON.stringify(reportes))
  },

  addReporte: (reporte: Omit<Reporte, 'id' | 'created_at'>): Reporte => {
    const reportes = storage.getReportes()
    const newReporte: Reporte = {
      ...reporte,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    }
    reportes.push(newReporte)
    storage.saveReportes(reportes)
    return newReporte
  },

  // Exportar/Importar datos
  exportData: (): string => {
    const data = {
      equipos: storage.getEquipos(),
      usuarios: storage.getUsuarios(),
      reportes: storage.getReportes(),
      export_date: new Date().toISOString()
    }
    return JSON.stringify(data, null, 2)
  },

  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData)
      if (data.equipos) storage.saveEquipos(data.equipos)
      if (data.usuarios) storage.saveUsuarios(data.usuarios)
      if (data.reportes) storage.saveReportes(data.reportes)
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  },

  // Inicializar datos por defecto
  initializeDefaultData: (): void => {
    const usuarios = storage.getUsuarios()
    if (usuarios.length === 0) {
      const adminUser: Usuario = {
        id: crypto.randomUUID(),
        nombre: 'Administrador',
        email: 'admin@telecom.com',
        rol: 'admin',
        created_at: new Date().toISOString()
      }
      storage.saveUsuarios([adminUser])
      storage.setCurrentUser(adminUser)
    }
  }
}
