// lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Solo declaramos las variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Variable para almacenar la instancia
let supabaseInstance: SupabaseClient | null = null

// Función para obtener/crear la instancia
export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) {
    return supabaseInstance
  }

  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Missing Supabase environment variables for production. ' +
        'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      )
    }
    
    // Para desarrollo, creamos un cliente mock
    supabaseInstance = createClient('', '')
    return supabaseInstance
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey)
  return supabaseInstance
}

// Exportamos la instancia
export const supabase = getSupabase()