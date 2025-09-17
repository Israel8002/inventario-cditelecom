'use client'

import { useState, useEffect } from 'react'
import { supabase, Equipo } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { 
  FileText, 
  Download, 
  Printer, 
  Filter, 
  BarChart3,
  PieChart,
  Calendar,
  MapPin
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Reporte {
  id: string
  titulo: string
  tipo_reporte: string
  filtros: any
  datos: any
  created_at: string
}

export default function ReportesList() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [loading, setLoading] = useState(true)
  const [showGenerarReporte, setShowGenerarReporte] = useState(false)
  const [filtros, setFiltros] = useState({
    tipo_equipo: '',
    estado: '',
    marca: '',
    unidad: '',
    fecha_desde: '',
    fecha_hasta: ''
  })
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    fetchEquipos()
    fetchReportes()
  }, [])

  const fetchEquipos = async () => {
    try {
      let query = supabase
        .from('equipos')
        .select('*')
        .order('created_at', { ascending: false })

      if (!isAdmin) {
        query = query.eq('user_id', user?.id)
      }

      const { data, error } = await query

      if (error) {
        toast.error('Error al cargar equipos: ' + error.message)
        return
      }

      setEquipos(data || [])
    } catch (error) {
      toast.error('Error inesperado al cargar equipos')
    }
  }

  const fetchReportes = async () => {
    try {
      let query = supabase
        .from('reportes')
        .select('*')
        .order('created_at', { ascending: false })

      if (!isAdmin) {
        query = query.eq('user_id', user?.id)
      }

      const { data, error } = await query

      if (error) {
        toast.error('Error al cargar reportes: ' + error.message)
        return
      }

      setReportes(data || [])
    } catch (error) {
      toast.error('Error inesperado al cargar reportes')
    } finally {
      setLoading(false)
    }
  }

  const generarReporte = async (tipo: string) => {
    try {
      setLoading(true)
      
      let equiposFiltrados = equipos

      // Aplicar filtros
      if (filtros.tipo_equipo) {
        equiposFiltrados = equiposFiltrados.filter(e => e.tipo_equipo === filtros.tipo_equipo)
      }
      if (filtros.estado) {
        equiposFiltrados = equiposFiltrados.filter(e => e.estado === filtros.estado)
      }
      if (filtros.marca) {
        equiposFiltrados = equiposFiltrados.filter(e => e.marca === filtros.marca)
      }
      if (filtros.unidad) {
        equiposFiltrados = equiposFiltrados.filter(e => e.unidad === filtros.unidad)
      }
      if (filtros.fecha_desde) {
        equiposFiltrados = equiposFiltrados.filter(e => e.fecha_ingreso >= filtros.fecha_desde)
      }
      if (filtros.fecha_hasta) {
        equiposFiltrados = equiposFiltrados.filter(e => e.fecha_ingreso <= filtros.fecha_hasta)
      }

      const titulo = `Reporte de ${tipo} - ${new Date().toLocaleDateString('es-ES')}`
      
      const reporteData = {
        titulo,
        tipo_reporte: tipo,
        filtros,
        datos: equiposFiltrados,
        user_id: user?.id
      }

      const { error } = await supabase
        .from('reportes')
        .insert(reporteData)

      if (error) {
        toast.error('Error al generar reporte: ' + error.message)
        return
      }

      toast.success('Reporte generado correctamente')
      fetchReportes()
      setShowGenerarReporte(false)
    } catch (error) {
      toast.error('Error inesperado al generar reporte')
    } finally {
      setLoading(false)
    }
  }

  const imprimirReporte = (reporte: Reporte) => {
    const ventanaImpresion = window.open('', '_blank')
    if (!ventanaImpresion) return

    const contenido = generarContenidoImpresion(reporte)
    ventanaImpresion.document.write(contenido)
    ventanaImpresion.document.close()
    ventanaImpresion.print()
  }

  const generarContenidoImpresion = (reporte: Reporte) => {
    const equipos = reporte.datos
    const estadisticas = calcularEstadisticas(equipos)

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reporte.titulo}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat { text-align: center; padding: 10px; border: 1px solid #ddd; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Sistema de Inventarios de Telecomunicaciones</h1>
          <h2>${reporte.titulo}</h2>
          <p>Generado el: ${new Date().toLocaleString('es-ES')}</p>
        </div>

        <div class="stats">
          <div class="stat">
            <h3>${estadisticas.total}</h3>
            <p>Total Equipos</p>
          </div>
          <div class="stat">
            <h3>${estadisticas.activos}</h3>
            <p>Activos</p>
          </div>
          <div class="stat">
            <h3>${estadisticas.mantenimiento}</h3>
            <p>En Mantenimiento</p>
          </div>
          <div class="stat">
            <h3>${estadisticas.danados}</h3>
            <p>Dañados</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Número de Serie</th>
              <th>Tipo</th>
              <th>Marca/Modelo</th>
              <th>Estado</th>
              <th>Ubicación</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            ${equipos.map((equipo: any) => `
              <tr>
                <td>${equipo.numero_serie}</td>
                <td>${equipo.tipo_equipo}</td>
                <td>${equipo.marca} ${equipo.modelo}</td>
                <td>${equipo.estado}</td>
                <td>${equipo.ubicacion}</td>
                <td>${equipo.responsable}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Reporte generado por: ${user?.email}</p>
          <p>Desarrollado por LSC. Israel Díaz</p>
        </div>
      </body>
      </html>
    `
  }

  const calcularEstadisticas = (equipos: Equipo[]) => {
    const total = equipos.length
    const activos = equipos.filter(e => e.estado === 'Activo').length
    const mantenimiento = equipos.filter(e => e.estado === 'Mantenimiento').length
    const danados = equipos.filter(e => e.estado === 'Dañado').length
    const retirados = equipos.filter(e => e.estado === 'Retirado').length

    return { total, activos, mantenimiento, danados, retirados }
  }

  const tiposEquipos = Array.from(new Set(equipos.map(e => e.tipo_equipo)))
  const estados = Array.from(new Set(equipos.map(e => e.estado)))
  const marcas = Array.from(new Set(equipos.map(e => e.marca)))
  const unidades = Array.from(new Set(equipos.map(e => e.unidad)))

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="loading" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          Cargando reportes...
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Reportes e Impresión
        </h1>
        <button 
          onClick={() => setShowGenerarReporte(true)}
          className="btn btn-primary"
        >
          <FileText size={20} />
          Generar Reporte
        </button>
      </div>

      {/* Estadísticas Generales */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Resumen General
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {Object.entries(calcularEstadisticas(equipos)).map(([key, value]) => (
            <div key={key} style={{ 
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: 'var(--background-color)',
              borderRadius: '0.375rem'
            }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold',
                color: 'var(--primary-color)'
              }}>
                {value}
              </div>
              <div style={{ 
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                textTransform: 'capitalize'
              }}>
                {key === 'total' ? 'Total Equipos' : key}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Reportes */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Reportes Generados
        </h3>
        
        {reportes.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: 'var(--text-secondary)'
          }}>
            <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No hay reportes generados</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reportes.map(reporte => (
              <div key={reporte.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'var(--background-color)',
                borderRadius: '0.375rem',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                    {reporte.titulo}
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {reporte.tipo_reporte} • {reporte.datos.length} equipos • 
                    {new Date(reporte.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => imprimirReporte(reporte)}
                    className="btn btn-outline"
                    style={{ padding: '0.5rem' }}
                    title="Imprimir"
                  >
                    <Printer size={16} />
                  </button>
                  <button
                    onClick={() => {
                      const contenido = generarContenidoImpresion(reporte)
                      const blob = new Blob([contenido], { type: 'text/html' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${reporte.titulo}.html`
                      a.click()
                    }}
                    className="btn btn-outline"
                    style={{ padding: '0.5rem' }}
                    title="Descargar"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Generar Reporte */}
      {showGenerarReporte && (
        <div className="modal-overlay" onClick={() => setShowGenerarReporte(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>
                Generar Nuevo Reporte
              </h2>
              <button
                onClick={() => setShowGenerarReporte(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div className="form-group">
                <label className="form-label">Tipo de Equipo</label>
                <select
                  value={filtros.tipo_equipo}
                  onChange={(e) => setFiltros({...filtros, tipo_equipo: e.target.value})}
                  className="form-select"
                >
                  <option value="">Todos los tipos</option>
                  {tiposEquipos.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  value={filtros.estado}
                  onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                  className="form-select"
                >
                  <option value="">Todos los estados</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Marca</label>
                <select
                  value={filtros.marca}
                  onChange={(e) => setFiltros({...filtros, marca: e.target.value})}
                  className="form-select"
                >
                  <option value="">Todas las marcas</option>
                  {marcas.map(marca => (
                    <option key={marca} value={marca}>{marca}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Unidad</label>
                <select
                  value={filtros.unidad}
                  onChange={(e) => setFiltros({...filtros, unidad: e.target.value})}
                  className="form-select"
                >
                  <option value="">Todas las unidades</option>
                  {unidades.map(unidad => (
                    <option key={unidad} value={unidad}>{unidad}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fecha Desde</label>
                <input
                  type="date"
                  value={filtros.fecha_desde}
                  onChange={(e) => setFiltros({...filtros, fecha_desde: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fecha Hasta</label>
                <input
                  type="date"
                  value={filtros.fecha_hasta}
                  onChange={(e) => setFiltros({...filtros, fecha_hasta: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)'
            }}>
              <button
                onClick={() => setShowGenerarReporte(false)}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button
                onClick={() => generarReporte('Inventario General')}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <div className="loading" /> : 'Generar Reporte'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
