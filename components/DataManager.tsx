'use client'

import { useState } from 'react'
import { storage } from '@/lib/storage'
import { useAuth } from './AuthProvider'
import { Trash2, Download, Upload, Database, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DataManager() {
  const [showConfirm, setShowConfirm] = useState(false)
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return null
  }

  const handleClearData = () => {
    storage.clearAllData()
    toast.success('Todos los datos han sido eliminados')
    setShowConfirm(false)
    // Recargar la página para limpiar el estado
    window.location.reload()
  }

  const handleExportData = () => {
    try {
      const data = storage.exportData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inventario-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Datos exportados correctamente')
    } catch (error) {
      toast.error('Error al exportar datos')
    }
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string
        const success = storage.importData(data)
        if (success) {
          toast.success('Datos importados correctamente')
          window.location.reload()
        } else {
          toast.error('Error al importar datos')
        }
      } catch (error) {
        toast.error('Error al procesar archivo')
      }
    }
    reader.readAsText(file)
  }

  const equipos = storage.getEquipos()
  const usuarios = storage.getUsuarios()
  const reportes = storage.getReportes()

  return (
    <div className="card">
      <h3 style={{ 
        marginBottom: '1.5rem',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Database size={24} />
        Gestión de Datos
      </h3>

      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '1rem',
          background: 'var(--surface-secondary)',
          borderRadius: '0.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            color: 'var(--primary-color)'
          }}>
            {equipos.length}
          </div>
          <div style={{ 
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            Equipos
          </div>
        </div>

        <div style={{ 
          textAlign: 'center',
          padding: '1rem',
          background: 'var(--surface-secondary)',
          borderRadius: '0.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            color: 'var(--success-color)'
          }}>
            {usuarios.length}
          </div>
          <div style={{ 
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            Usuarios
          </div>
        </div>

        <div style={{ 
          textAlign: 'center',
          padding: '1rem',
          background: 'var(--surface-secondary)',
          borderRadius: '0.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            color: 'var(--warning-color)'
          }}>
            {reportes.length}
          </div>
          <div style={{ 
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            Reportes
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <button
          onClick={handleExportData}
          className="btn btn-primary"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <Download size={20} />
          Exportar Datos
        </button>

        <label className="btn btn-outline" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '0.5rem',
          cursor: 'pointer'
        }}>
          <Upload size={20} />
          Importar Datos
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            style={{ display: 'none' }}
          />
        </label>

        <button
          onClick={() => setShowConfirm(true)}
          className="btn btn-error"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <Trash2 size={20} />
          Limpiar Todo
        </button>
      </div>

      {/* Modal de Confirmación */}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '1rem',
              gap: '0.5rem'
            }}>
              <AlertTriangle size={24} style={{ color: 'var(--error-color)' }} />
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
                Confirmar Eliminación
              </h3>
            </div>

            <p style={{ 
              marginBottom: '1.5rem',
              color: 'var(--text-secondary)'
            }}>
              ¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.
            </p>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '1rem'
            }}>
              <button
                onClick={() => setShowConfirm(false)}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearData}
                className="btn btn-error"
              >
                Eliminar Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
