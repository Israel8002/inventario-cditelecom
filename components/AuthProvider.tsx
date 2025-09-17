'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { storage, Usuario } from '@/lib/storage'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: Usuario | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, nombre: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Inicializar datos por defecto
    storage.initializeDefaultData()
    
    // Obtener usuario actual
    const currentUser = storage.getCurrentUser()
    setUser(currentUser)
    setIsAdmin(currentUser?.rol === 'admin')
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // Buscar usuario por email
      const usuarios = storage.getUsuarios()
      const usuario = usuarios.find(u => u.email === email)
      
      if (!usuario) {
        toast.error('Usuario no encontrado')
        return
      }

      // En un sistema real, aquí verificarías la contraseña
      // Por simplicidad, aceptamos cualquier contraseña
      setUser(usuario)
      setIsAdmin(usuario.rol === 'admin')
      storage.setCurrentUser(usuario)
      
      toast.success('Sesión iniciada correctamente')
    } catch (error) {
      toast.error('Error inesperado al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, nombre: string) => {
    try {
      setLoading(true)
      
      // Verificar si el usuario ya existe
      const usuarios = storage.getUsuarios()
      const usuarioExistente = usuarios.find(u => u.email === email)
      
      if (usuarioExistente) {
        toast.error('El usuario ya existe')
        return
      }

      // Crear nuevo usuario
      const nuevoUsuario: Usuario = {
        id: crypto.randomUUID(),
        email,
        nombre,
        rol: 'usuario',
        created_at: new Date().toISOString()
      }

      // Guardar usuario
      usuarios.push(nuevoUsuario)
      storage.saveUsuarios(usuarios)
      
      // Establecer como usuario actual
      setUser(nuevoUsuario)
      setIsAdmin(false)
      storage.setCurrentUser(nuevoUsuario)
      
      toast.success('Usuario creado correctamente')
    } catch (error) {
      toast.error('Error inesperado al registrarse')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setUser(null)
      setIsAdmin(false)
      storage.setCurrentUser(null as any)
      toast.success('Sesión cerrada correctamente')
    } catch (error) {
      toast.error('Error inesperado al cerrar sesión')
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}