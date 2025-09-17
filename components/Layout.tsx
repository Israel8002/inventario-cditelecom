'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { 
  Menu, 
  X, 
  Home, 
  Package, 
  QrCode, 
  FileText, 
  Settings, 
  LogOut,
  User
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut, isAdmin } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Equipos', href: '/equipos', icon: Package },
    { name: 'Escanear QR', href: '/escanear', icon: QrCode },
    { name: 'Reportes', href: '/reportes', icon: FileText },
    ...(isAdmin ? [{ name: 'Usuarios', href: '/usuarios', icon: User }] : []),
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="modal-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{ zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '280px',
          backgroundColor: 'var(--surface-color)',
          borderRight: '1px solid var(--border-color)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          zIndex: 50,
          overflowY: 'auto'
        }}
      >
        <div style={{ padding: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '2rem'
          }}>
            <h1 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              color: 'var(--primary-color)'
            }}>
              Inventarios Telecom
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
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

          <nav>
            <ul style={{ listStyle: 'none' }}>
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name} style={{ marginBottom: '0.5rem' }}>
                    <a
                      href={item.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--background-color)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <Icon size={20} style={{ marginRight: '0.75rem' }} />
                      {item.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div style={{ 
            marginTop: 'auto', 
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: 'var(--background-color)',
              borderRadius: '0.375rem'
            }}>
              <User size={20} style={{ marginRight: '0.75rem' }} />
              <div>
                <p style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  margin: 0
                }}>
                  {user?.email}
                </p>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  {isAdmin ? 'Administrador' : 'Usuario'}
                </p>
              </div>
            </div>
            
            <button
              onClick={signOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.75rem',
                background: 'none',
                border: '1px solid var(--error-color)',
                borderRadius: '0.375rem',
                color: 'var(--error-color)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--error-color)'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--error-color)'
              }}
            >
              <LogOut size={20} style={{ marginRight: '0.75rem' }} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        marginLeft: '0',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'var(--surface-color)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '0.5rem'
            }}
          >
            <Menu size={24} />
          </button>
          
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Sistema de Inventarios
          </h1>
          
          <div style={{ width: '40px' }} />
        </header>

        {/* Page Content */}
        <main style={{ padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
