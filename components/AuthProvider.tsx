'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, nombre: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkUserRole(session.user.id)
      }
      setLoading(false)
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await checkUserRole(session.user.id)
        } else {
          setIsAdmin(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error checking user role:', error)
        return
      }

      setIsAdmin(data?.rol === 'admin')
    } catch (error) {
      console.error('Error checking user role:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error('Error al iniciar sesión: ' + error.message)
        return
      }

      toast.success('Sesión iniciada correctamente')
    } catch (error) {
      toast.error('Error inesperado al iniciar sesión')
    }
  }

  const signUp = async (email: string, password: string, nombre: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        toast.error('Error al registrarse: ' + error.message)
        return
      }

      if (data.user) {
        // Crear registro en la tabla usuarios
        const { error: insertError } = await supabase
          .from('usuarios')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            nombre,
            rol: 'usuario'
          })

        if (insertError) {
          console.error('Error creating user profile:', insertError)
        }
      }

      toast.success('Registro exitoso. Revisa tu correo para confirmar tu cuenta.')
    } catch (error) {
      toast.error('Error inesperado al registrarse')
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast.error('Error al cerrar sesión: ' + error.message)
        return
      }

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
