'use client'

import { useAuth } from '@/components/AuthProvider'
import LoginForm from '@/components/LoginForm'
import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'
import { supabase, Equipo } from '@/lib/supabase'
import { Package, QrCode, FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

export default function Home() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState({
    totalEquipos: 0,
    equiposActivos: 0,
    equiposMantenimiento: 0,
    equiposDanados: 0,
    equiposRetirados: 0
  })

  useEffect(() => {
    if (user && !loading) {
      fetchStats()
    }
  }, [user, loading])

  const fetchStats = async () => {
    try {
      // Usar una consulta más eficiente con agregación
      const { data, error } = await supabase
        .from('equipos')
        .select('estado', { count: 'exact' })

      if (error) {
        console.error('Error fetching stats:', error)
        return
      }

      const equipos = data || []
      const totalEquipos = equipos.length
      const equiposActivos = equipos.filter(e => e.estado === 'Activo').length
      const equiposMantenimiento = equipos.filter(e => e.estado === 'Mantenimiento').length
      const equiposDanados = equipos.filter(e => e.estado === 'Dañado').length
      const equiposRetirados = equipos.filter(e => e.estado === 'Retirado').length

      setStats({
        totalEquipos,
        equiposActivos,
        equiposMantenimiento,
        equiposDanados,
        equiposRetirados
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="loading" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <Layout>
      <div>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            Bienvenido al Sistema de Inventarios
          </h1>
          <p style={{ 
            fontSize: '1.125rem',
            color: 'var(--text-secondary)'
          }}>
            Gestión eficiente de equipos de telecomunicaciones
          </p>
        </div>

        {/* Estadísticas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <Package size={48} style={{ 
              color: 'var(--primary-color)', 
              margin: '0 auto 1rem' 
            }} />
            <h3 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              margin: '0 0 0.5rem 0',
              color: 'var(--text-primary)'
            }}>
              {stats.totalEquipos}
            </h3>
            <p style={{ 
              margin: 0,
              color: 'var(--text-secondary)'
            }}>
              Total de Equipos
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <CheckCircle size={48} style={{ 
              color: 'var(--success-color)', 
              margin: '0 auto 1rem' 
            }} />
            <h3 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              margin: '0 0 0.5rem 0',
              color: 'var(--text-primary)'
            }}>
              {stats.equiposActivos}
            </h3>
            <p style={{ 
              margin: 0,
              color: 'var(--text-secondary)'
            }}>
              Equipos Activos
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <TrendingUp size={48} style={{ 
              color: 'var(--warning-color)', 
              margin: '0 auto 1rem' 
            }} />
            <h3 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              margin: '0 0 0.5rem 0',
              color: 'var(--text-primary)'
            }}>
              {stats.equiposMantenimiento}
            </h3>
            <p style={{ 
              margin: 0,
              color: 'var(--text-secondary)'
            }}>
              En Mantenimiento
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <AlertTriangle size={48} style={{ 
              color: 'var(--error-color)', 
              margin: '0 auto 1rem' 
            }} />
            <h3 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              margin: '0 0 0.5rem 0',
              color: 'var(--text-primary)'
            }}>
              {stats.equiposDanados}
            </h3>
            <p style={{ 
              margin: 0,
              color: 'var(--text-secondary)'
            }}>
              Equipos Dañados
            </p>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="card">
          <h2 style={{ 
            marginBottom: '1.5rem',
            color: 'var(--text-primary)'
          }}>
            Acciones Rápidas
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <a 
              href="/equipos" 
              className="btn btn-primary"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1rem',
                textDecoration: 'none'
              }}
            >
              <Package size={24} />
              Gestionar Equipos
            </a>

            <a 
              href="/escanear" 
              className="btn btn-success"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1rem',
                textDecoration: 'none'
              }}
            >
              <QrCode size={24} />
              Escanear QR
            </a>

            <a 
              href="/reportes" 
              className="btn btn-warning"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1rem',
                textDecoration: 'none'
              }}
            >
              <FileText size={24} />
              Generar Reportes
            </a>
          </div>
        </div>

        {/* Información del Sistema */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 style={{ 
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Información del Sistema
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <h4 style={{ 
                margin: '0 0 0.5rem 0',
                color: 'var(--text-primary)'
              }}>
                Características Principales
              </h4>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '1.5rem',
                color: 'var(--text-secondary)'
              }}>
                <li>Escaneo de códigos QR automático</li>
                <li>Gestión completa de inventarios</li>
                <li>Reportes e impresión</li>
                <li>Diseño responsive</li>
                <li>Multiplataforma</li>
              </ul>
            </div>

            <div>
              <h4 style={{ 
                margin: '0 0 0.5rem 0',
                color: 'var(--text-primary)'
              }}>
                Soporte Técnico
              </h4>
              <p style={{ 
                margin: 0,
                color: 'var(--text-secondary)'
              }}>
                Para soporte técnico o preguntas sobre la aplicación, 
                contactar al equipo de desarrollo.
              </p>
              <p style={{ 
                margin: '0.5rem 0 0 0',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)'
              }}>
                <strong>Desarrollado por LSC. Israel Díaz</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
