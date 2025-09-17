import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la base de datos
export interface Equipo {
  id: string
  numero_serie: string
  tipo_equipo: string
  marca: string
  modelo: string
  estado: 'Activo' | 'Mantenimiento' | 'Dañado' | 'Retirado'
  ubicacion: string
  unidad: string
  fecha_ingreso: string
  fecha_ultima_revision: string
  responsable: string
  observaciones?: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Usuario {
  id: string
  email: string
  nombre: string
  rol: 'admin' | 'usuario'
  created_at: string
}
