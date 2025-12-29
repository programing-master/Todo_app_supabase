"use client"

import { createContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Task {
  id: string
  task: string
  description?: string
  done: boolean
  created_at?: string
}

interface TaskContextType {
  tasks: Task[]
  loading: boolean
  error: string | null
  createTask: (taskData: any) => Promise<any>
  getTasks: () => Promise<any>
  getTask: (id: string) => Promise<any>
  updateTask: (id: string, updates: any) => Promise<any>
  deleteTask: (id: string) => Promise<any>
  setError: (error: string | null) => void
}

export const TaskContext = createContext<TaskContextType>({
  tasks: [],
  loading: false,
  error: null,
  createTask: async () => ({}),
  getTasks: async () => ({}),
  getTask: async () => ({}),
  updateTask: async () => ({}),
  deleteTask: async () => ({}),
  setError: () => {}
})

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTask = async (taskData: any) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('task')
        .insert([{
          task: taskData.task || '',
          description: taskData.description || '',
          done: taskData.done || false,
          
        }])
        .select()
        .single()

      if (error) throw error

      setTasks(prev => [data, ...prev])
      return { success: true, data }
      
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const getTasks = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('task')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setTasks(data || [])
      return { success: true, data }
      
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const getTask = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('task')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return { success: true, data }
      
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (id: string, updates: any) => {
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('task')
        .update({
          ...updates,
          
        })
        .eq('id', id)
        .select()
        .single()
  
  
      if (error) throw error
        setTasks(prev => prev.map(task => task.id === id ? { ...task, ...data } : task))
      return { success: true, data }
      
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('task')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTasks(prev => prev.filter(task => task.id !== id))
      return { success: true }
      
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTasks()
  }, [])

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      createTask,
      getTasks,
      getTask,
      updateTask,
      deleteTask,
      setError
    }}>
      {children}
    </TaskContext.Provider>
  )
}