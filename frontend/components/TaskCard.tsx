"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '@/hooks/useTasks'

interface TaskCardProps {
  task: {
    id: string
    task: string
    description?: string
    done: boolean
    created_at?: string
  }
}

export default function TaskCard({ task }: TaskCardProps) {
  const router = useRouter()
  const { deleteTask, updateTask } = useTasks()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const handleEdit = () => {
    router.push(`/edit/${task.id}`)
  }

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      setIsDeleting(true)
      try {
        await deleteTask(task.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleToggleDone = async () => {
    setIsToggling(true)
    try {
      await updateTask(task.id, { 
        done: !task.done,
        updated_at: new Date().toISOString()
      })
    } finally {
      setIsToggling(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sin fecha'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className={`group border rounded-xl p-4 transition-all duration-300 hover:shadow-md ${
      task.done 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200 bg-white hover:border-blue-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={handleToggleDone}
            disabled={isToggling}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              task.done
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-blue-500'
            } ${isToggling ? 'opacity-50' : ''}`}
          >
            {task.done && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-gray-800 mb-1 ${
              task.done ? 'line-through text-gray-500' : ''
            }`}>
              {task.task || 'Tarea sin título'}
            </h3>
            
            {task.description && (
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500">
              {task.created_at && (
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(task.created_at)}</span>
                </div>
              )}

              <span className={`px-2 py-0.5 rounded-full text-xs ${
                task.done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {task.done ? 'Completada' : 'Pendiente'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Editar tarea"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
            title="Eliminar tarea"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}