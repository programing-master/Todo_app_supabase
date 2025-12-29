"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '@/hooks/useTasks'

interface TaskFormProps {
  taskId?: string
}

export default function TaskForm({ taskId }: TaskFormProps) {
  const router = useRouter()
  const { createTask, updateTask, getTask, loading } = useTasks()
  
  const [formData, setFormData] = useState({
    task: '',
    description: '',
    done: false
  })

  const isEditing = !!taskId

  useEffect(() => {
    if (taskId) {
      const loadTask = async () => {
        const result = await getTask(taskId)
        if (result.success && result.data) {
          const task = result.data
          setFormData({
            task: task.task || '',
            description: task.description || '',
            done: task.done || false
          })
        }
      }
      loadTask()
    }
  }, [taskId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.task.trim()) {
      alert('Por favor, escribe un título para la tarea')
      return
    }

    try {
      if (isEditing && taskId) {
        await updateTask(taskId, formData)
        alert('✅ Tarea actualizada correctamente')
        router.push('/')
      } else {
        await createTask(formData)
        alert('✅ Tarea creada correctamente')
        setFormData({
          task: '',
          description: '',
          done: false
        })
      }
    } catch (error: any) {
      alert(`❌ Error: ${error.message || 'Error desconocido'}`)
    }
  }

  const handleCancel = () => {
    if (window.confirm('¿Descartar cambios?')) {
      if (isEditing) {
        router.push('/')
      } else {
        setFormData({
          task: '',
          description: '',
          done: false
        })
      }
    }
  }

  return (
    <div className="w-full md:w-[40%] border border-gray-300 rounded-xl p-6 bg-white shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isEditing ? 'bg-yellow-100' : 'bg-blue-100'
          }`}>
            {isEditing ? '✏️' : '➕'}
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
        </div>
        <p className="text-gray-500 text-sm">
          {isEditing ? 'Modifica los detalles de tu tarea' : 'Completa los detalles para crear una nueva tarea'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="task"
            value={formData.task}
            onChange={handleChange}
            placeholder="¿Qué necesitas hacer?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Detalles adicionales (opcional)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>

        {isEditing && (
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="done"
                  checked={formData.done}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition ${
                  formData.done ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.done ? 'transform translate-x-5' : 'translate-x-1'
                  }`}></div>
                </div>
              </div>
              <span className="text-gray-700 font-medium">
                {formData.done ? 'Completada' : 'Pendiente'}
              </span>
            </label>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading || !formData.task.trim()}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
              isEditing
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white disabled:bg-yellow-300'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white disabled:from-blue-300 disabled:to-blue-400'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isEditing ? 'Actualizando...' : 'Creando...'}
              </div>
            ) : (
              isEditing ? 'Actualizar Tarea' : 'Crear Tarea'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}