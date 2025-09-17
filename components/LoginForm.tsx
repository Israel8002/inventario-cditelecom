'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Eye, EyeOff, User, Lock, Mail, Package } from 'lucide-react'

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: ''
  })
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password)
      } else {
        await signUp(formData.email, formData.password, formData.nombre)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--gradient-surface)',
      padding: '1rem'
    }}>
      <div className="card" style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'var(--gradient-card)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-xl)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'var(--gradient-primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
          }}>
            <Package size={40} style={{ color: 'white' }} />
          </div>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            background: 'var(--gradient-primary)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Sistema de Inventarios
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)',
            fontSize: '1rem'
          }}>
            Equipos de Telecomunicaciones
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">
                <User size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ingresa tu nombre completo"
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <Mail size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="••••••••"
                required
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? (
              <div className="loading" />
            ) : (
              isLogin ? 'Iniciar Sesión' : 'Registrarse'
            )}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isLogin 
                ? '¿No tienes cuenta? Regístrate aquí' 
                : '¿Ya tienes cuenta? Inicia sesión aquí'
              }
            </button>
          </div>
        </form>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: 'var(--surface-secondary)',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          <p style={{ 
            marginBottom: '0.5rem', 
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}>
            🔑 Credenciales de prueba:
          </p>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.25rem',
            fontFamily: 'monospace'
          }}>
            <p><strong style={{ color: 'var(--primary-color)' }}>Admin:</strong> admin@telecom.com</p>
            <p><strong style={{ color: 'var(--primary-color)' }}>Contraseña:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
