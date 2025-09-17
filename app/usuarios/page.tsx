'use client'

import { useState, useEffect } from 'react'
import { storage, Usuario } from '@/lib/storage'
import { useAuth } from '@/components/AuthProvider'
import { User, Plus, Edit, Trash2, Shield, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    if (isAdmin) {
      fetchUsuarios()
    } else {
      setLoading(false)
    }
  }, [isAdmin])

  const fetchUsuarios = () => {
    try {
      setLoading(true)
      const allUsuarios = storage.getUsuarios()
      setUsuarios(allUsuarios)
    } catch (error) {
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return
    }

    try {
      // No permitir eliminar el último admin
      const allUsuarios = storage.getUsuarios()
      const admins = allUsuarios.filter(u => u.rol === 'admin')
      
      if (admins.length === 1 && admins[0].id === id) {
        toast.error('No se puede eliminar el último administrador')
        return
      }

      // Eliminar usuario
      const updatedUsuarios = allUsuarios.filter(u => u.id !== id)
      storage.saveUsuarios(updatedUsuarios)
      
      toast.success('Usuario eliminado correctamente')
      fetchUsuarios()
    } catch (error) {
      toast.error('Error inesperado al eliminar usuario')
    }
  }

  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Shield size={64} style={{ color: 'var(--error-color)', margin: '0 auto 1rem' }} />
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Acceso Denegado
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="loading" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          Cargando usuarios...
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
          Gestión de Usuarios
        </h1>
      </div>

      {/* Lista de Usuarios */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      No hay usuarios registrados
                    </p>
                  </td>
                </tr>
              ) : (
                usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '500' }}>{usuario.nombre}</div>
                        </div>
                      </div>
                    </td>
                    <td>{usuario.email}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: usuario.rol === 'admin' ? '#dcfce7' : '#f3f4f6',
                        color: usuario.rol === 'admin' ? '#166534' : '#374151'
                      }}>
                        {usuario.rol === 'admin' ? (
                          <>
                            <Shield size={12} style={{ marginRight: '0.25rem' }} />
                            Administrador
                          </>
                        ) : (
                          <>
                            <UserCheck size={12} style={{ marginRight: '0.25rem' }} />
                            Usuario
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      {new Date(usuario.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {usuario.id !== user?.id && (
                          <button
                            onClick={() => handleDelete(usuario.id)}
                            className="btn btn-error"
                            style={{ padding: '0.5rem' }}
                            title="Eliminar usuario"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ 
          marginBottom: '1rem',
          color: 'var(--text-primary)'
        }}>
          Información de Usuarios
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <h4 style={{ 
              margin: '0 0 0.5rem 0',
              color: 'var(--text-primary)'
            }}>
              Administradores
            </h4>
            <p style={{ 
              margin: 0,
              color: 'var(--text-secondary)'
            }}>
              Pueden ver y gestionar todos los equipos y reportes del sistema.
            </p>
          </div>

          <div>
            <h4 style={{ 
              margin: '0 0 0.5rem 0',
              color: 'var(--text-primary)'
            }}>
              Usuarios
            </h4>
            <p style={{ 
              margin: 0,
              color: 'var(--text-secondary)'
            }}>
              Pueden gestionar solo sus propios equipos y reportes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
