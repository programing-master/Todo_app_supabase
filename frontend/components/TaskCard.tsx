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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleEdit = () => {
    router.push(`/edit/${task.id}`)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteTask(task.id)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
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
    <div className={`border rounded-xl p-4 transition-all duration-300 ${
      task.done 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200 bg-white'
    }`}>
      {/* Confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium mb-2">
            ¿Eliminar esta tarea?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:bg-red-300"
            >
              {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
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
            <h3 className={`font-medium text-gray-800 mb-1 truncate ${
              task.done ? 'line-through text-gray-500' : ''
            }`}>
              {task.task || 'Tarea sin título'}
            </h3>
            
            {task.description && (
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
              {task.created_at && (
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="whitespace-nowrap">{formatDate(task.created_at)}</span>
                </div>
              )}

              <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                task.done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {task.done ? '✅ Completada' : '⏳ Pendiente'}
              </span>
            </div>
          </div>
        </div>

        {/* Botones siempre visibles - Mejor alineados */}
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          <button
            onClick={handleEdit}
            className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Editar tarea"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
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