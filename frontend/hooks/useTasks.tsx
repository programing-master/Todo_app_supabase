import { TaskContext } from '@/context/task.context'
import { useContext } from 'react'

export const useTasks = () => {
  const context = useContext(TaskContext)
  
  if (!context) {
    throw new Error('useTasks debe usarse dentro de TaskProvider')
  }
  
  return context
}