'use client'

import { useState, useEffect } from 'react'
import { supabase, Equipo } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { Search, Plus, Edit, Trash2, Eye, QrCode } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EquiposList() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null)
  const [showModal, setShowModal] = useState(false)
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    fetchEquipos()
  }, [])

  const fetchEquipos = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('equipos')
        .select('*')
        .order('created_at', { ascending: false })

      // Si no es admin, solo mostrar equipos del usuario
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
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('equipos')
        .delete()
        .eq('id', id)

      if (error) {
        toast.error('Error al eliminar equipo: ' + error.message)
        return
      }

      toast.success('Equipo eliminado correctamente')
      fetchEquipos()
    } catch (error) {
      toast.error('Error inesperado al eliminar equipo')
    }
  }

  const filteredEquipos = equipos.filter(equipo => {
    const matchesSearch = 
      equipo.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.tipo_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEstado = !filterEstado || equipo.estado === filterEstado
    const matchesTipo = !filterTipo || equipo.tipo_equipo === filterTipo

    return matchesSearch && matchesEstado && matchesTipo
  })

  const tiposEquipos = Array.from(new Set(equipos.map(e => e.tipo_equipo)))
  const estados = Array.from(new Set(equipos.map(e => e.estado)))

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="loading" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          Cargando equipos...
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
          Gestión de Equipos
        </h1>
        <a href="/equipos/nuevo" className="btn btn-primary">
          <Plus size={20} />
          Nuevo Equipo
        </a>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          alignItems: 'end'
        }}>
          <div className="form-group">
            <label className="form-label">Buscar</label>
            <div style={{ position: 'relative' }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '0.75rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)'
                }} 
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                placeholder="Buscar por serie, tipo, marca, modelo..."
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Equipo</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
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
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="form-select"
            >
              <option value="">Todos los estados</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Equipos */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Número de Serie</th>
                <th>Tipo</th>
                <th>Marca/Modelo</th>
                <th>Estado</th>
                <th>Ubicación</th>
                <th>Responsable</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipos.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {searchTerm || filterEstado || filterTipo 
                        ? 'No se encontraron equipos con los filtros aplicados'
                        : 'No hay equipos registrados'
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEquipos.map(equipo => (
                  <tr key={equipo.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <code style={{ 
                          backgroundColor: 'var(--background-color)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem'
                        }}>
                          {equipo.numero_serie}
                        </code>
                        <QrCode size={16} style={{ color: 'var(--text-secondary)' }} />
                      </div>
                    </td>
                    <td>{equipo.tipo_equipo}</td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500' }}>{equipo.marca}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {equipo.modelo}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${equipo.estado.toLowerCase()}`}>
                        {equipo.estado}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div>{equipo.ubicacion}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {equipo.unidad}
                        </div>
                      </div>
                    </td>
                    <td>{equipo.responsable}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            setSelectedEquipo(equipo)
                            setShowModal(true)
                          }}
                          className="btn btn-outline"
                          style={{ padding: '0.5rem' }}
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <a
                          href={`/equipos/editar/${equipo.id}`}
                          className="btn btn-outline"
                          style={{ padding: '0.5rem' }}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </a>
                        <button
                          onClick={() => handleDelete(equipo.id)}
                          className="btn btn-error"
                          style={{ padding: '0.5rem' }}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles */}
      {showModal && selectedEquipo && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
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
                Detalles del Equipo
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Número de Serie
                </label>
                <p style={{ margin: '0.25rem 0 1rem 0' }}>{selectedEquipo.numero_serie}</p>
              </div>

              <div>
                <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Tipo de Equipo
                </label>
                <p style={{ margin: '0.25rem 0 1rem 0' }}>{selectedEquipo.tipo_equipo}</p>
              </div>

              <div>
                <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Marca
                </label>
                <p style={{ margin: '0.25rem 0 1rem 0' }}>{selectedEquipo.marca}</p>
              </div>

              <div>
                <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Modelo
                </label>
                <p style={{ margin: '0.25rem 0 1rem 0' }}>{selectedEquipo.modelo}</p>
              </div>

              <div>
                <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Estado
                </label>
                <div style={{ margin: '0.25rem 0 1rem 0' }}>
                  <span className={`status-badge status-${selectedEquipo.estado.toLowerCase()}`}>
                    {selectedEquipo.estado}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Ubicación
                </label>
                <p style={{ margin: '0.25rem 0 1rem 0' }}>{selectedEquipo.ubicacion}</p>
              </div>

              <div>
                <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Unidad
                </label>
                <p style={{ margin: '0.25rem 0 1rem 0' }}>{selectedEquipo.unidad}</p>
              </div>

              <div>
                <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Responsable
                </label>
                <p style={{ margin: '0.25rem 0 1rem 0' }}>{selectedEquipo.responsable}</p>
              </div>

              <div>
                <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Fecha de Ingreso
                </label>
                <p style={{ margin: '0.25rem 0 1rem 0' }}>
                  {new Date(selectedEquipo.fecha_ingreso).toLocaleDateString('es-ES')}
                </p>
              </div>

              <div>
                <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Última Revisión
                </label>
                <p style={{ margin: '0.25rem 0 1rem 0' }}>
                  {selectedEquipo.fecha_ultima_revision 
                    ? new Date(selectedEquipo.fecha_ultima_revision).toLocaleDateString('es-ES')
                    : 'No registrada'
                  }
                </p>
              </div>

              {selectedEquipo.observaciones && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                    Observaciones
                  </label>
                  <p style={{ margin: '0.25rem 0 1rem 0' }}>{selectedEquipo.observaciones}</p>
                </div>
              )}
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '1rem',
              marginTop: '2rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)'
            }}>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
              >
                Cerrar
              </button>
              <a
                href={`/equipos/editar/${selectedEquipo.id}`}
                className="btn btn-primary"
              >
                Editar Equipo
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
