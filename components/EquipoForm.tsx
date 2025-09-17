'use client'

import { useState, useEffect } from 'react'
import { supabase, Equipo } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { ArrowLeft, Save, QrCode } from 'lucide-react'
import toast from 'react-hot-toast'

interface EquipoFormProps {
  equipoId?: string
  onSuccess?: () => void
}

export default function EquipoForm({ equipoId, onSuccess }: EquipoFormProps) {
  const [loading, setLoading] = useState(false)
  const [equipo, setEquipo] = useState<Partial<Equipo>>({
    numero_serie: '',
    tipo_equipo: '',
    marca: '',
    modelo: '',
    estado: 'Activo',
    ubicacion: '',
    unidad: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    fecha_ultima_revision: '',
    responsable: '',
    observaciones: ''
  })
  const { user } = useAuth()

  const tiposEquipos = [
    'Router',
    'Switch',
    'Modem',
    'Antena',
    'Repetidor',
    'Access Point',
    'Firewall',
    'Servidor',
    'UPS',
    'Otro'
  ]

  const estados = ['Activo', 'Mantenimiento', 'Dañado', 'Retirado']

  const unidades = [
    'Hospital General',
    'UMF',
    'Subdelegación',
    'Oficina Central',
    'Almacén',
    'Otro'
  ]

  useEffect(() => {
    if (equipoId) {
      fetchEquipo()
    }
  }, [equipoId])

  const fetchEquipo = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('equipos')
        .select('*')
        .eq('id', equipoId)
        .single()

      if (error) {
        toast.error('Error al cargar equipo: ' + error.message)
        return
      }

      setEquipo(data)
    } catch (error) {
      toast.error('Error inesperado al cargar equipo')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const equipoData = {
        ...equipo,
        user_id: user?.id,
        fecha_ultima_revision: equipo.fecha_ultima_revision || null
      }

      if (equipoId) {
        // Actualizar equipo existente
        const { error } = await supabase
          .from('equipos')
          .update(equipoData)
          .eq('id', equipoId)

        if (error) {
          toast.error('Error al actualizar equipo: ' + error.message)
          return
        }

        toast.success('Equipo actualizado correctamente')
      } else {
        // Crear nuevo equipo
        const { error } = await supabase
          .from('equipos')
          .insert(equipoData)

        if (error) {
          toast.error('Error al crear equipo: ' + error.message)
          return
        }

        toast.success('Equipo creado correctamente')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        window.location.href = '/equipos'
      }
    } catch (error) {
      toast.error('Error inesperado al guardar equipo')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEquipo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateQR = () => {
    // Esta función se implementará con la librería QR
    toast.success('Función de QR en desarrollo')
  }

  if (loading && equipoId) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="loading" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          Cargando equipo...
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        <a 
          href="/equipos" 
          className="btn btn-outline"
          style={{ padding: '0.5rem' }}
        >
          <ArrowLeft size={20} />
        </a>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          margin: 0
        }}>
          {equipoId ? 'Editar Equipo' : 'Nuevo Equipo'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Número de Serie */}
            <div className="form-group">
              <label className="form-label">
                Número de Serie *
                <button
                  type="button"
                  onClick={generateQR}
                  className="btn btn-outline"
                  style={{ 
                    marginLeft: '0.5rem', 
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem'
                  }}
                >
                  <QrCode size={16} />
                  Generar QR
                </button>
              </label>
              <input
                type="text"
                name="numero_serie"
                value={equipo.numero_serie || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: ABC123456789"
                required
              />
            </div>

            {/* Tipo de Equipo */}
            <div className="form-group">
              <label className="form-label">Tipo de Equipo *</label>
              <select
                name="tipo_equipo"
                value={equipo.tipo_equipo || ''}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Seleccionar tipo</option>
                {tiposEquipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            {/* Marca */}
            <div className="form-group">
              <label className="form-label">Marca *</label>
              <input
                type="text"
                name="marca"
                value={equipo.marca || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: Cisco, HP, Dell"
                required
              />
            </div>

            {/* Modelo */}
            <div className="form-group">
              <label className="form-label">Modelo *</label>
              <input
                type="text"
                name="modelo"
                value={equipo.modelo || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: Catalyst 2960, ProCurve 2520"
                required
              />
            </div>

            {/* Estado */}
            <div className="form-group">
              <label className="form-label">Estado *</label>
              <select
                name="estado"
                value={equipo.estado || ''}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                {estados.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            {/* Ubicación */}
            <div className="form-group">
              <label className="form-label">Ubicación Física *</label>
              <input
                type="text"
                name="ubicacion"
                value={equipo.ubicacion || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: Sala de Servidores, Rack 1"
                required
              />
            </div>

            {/* Unidad */}
            <div className="form-group">
              <label className="form-label">Unidad *</label>
              <select
                name="unidad"
                value={equipo.unidad || ''}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Seleccionar unidad</option>
                {unidades.map(unidad => (
                  <option key={unidad} value={unidad}>{unidad}</option>
                ))}
              </select>
            </div>

            {/* Responsable */}
            <div className="form-group">
              <label className="form-label">Responsable *</label>
              <input
                type="text"
                name="responsable"
                value={equipo.responsable || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Nombre del responsable"
                required
              />
            </div>

            {/* Fecha de Ingreso */}
            <div className="form-group">
              <label className="form-label">Fecha de Ingreso *</label>
              <input
                type="date"
                name="fecha_ingreso"
                value={equipo.fecha_ingreso || ''}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* Fecha de Última Revisión */}
            <div className="form-group">
              <label className="form-label">Fecha de Última Revisión</label>
              <input
                type="date"
                name="fecha_ultima_revision"
                value={equipo.fecha_ultima_revision || ''}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            {/* Observaciones */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Observaciones</label>
              <textarea
                name="observaciones"
                value={equipo.observaciones || ''}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Notas adicionales sobre el equipo..."
                rows={4}
              />
            </div>
          </div>

          {/* Botones */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '1rem',
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <a href="/equipos" className="btn btn-outline">
              Cancelar
            </a>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="loading" />
              ) : (
                <>
                  <Save size={20} />
                  {equipoId ? 'Actualizar' : 'Crear'} Equipo
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
