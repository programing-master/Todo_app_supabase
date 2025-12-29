"use client"

import React, { useEffect } from 'react'
import TaskCard from './TaskCard'
import { useTasks } from '@/hooks/useTasks'

export default function TaskList() {
  const { tasks, loading, error, getTasks } = useTasks()

  useEffect(() => {
    getTasks()
  }, [])

  if (loading) {
    return (
      <div className="w-full md:w-[60%] border border-gray-300 rounded-xl h-[70vh] p-6 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Cargando tareas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full md:w-[60%] border border-red-200 rounded-xl h-[70vh] p-6 bg-red-50 shadow-sm">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={getTasks}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="w-full md:w-[60%] border border-gray-300 rounded-xl h-[70vh] p-6 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-blue-500 text-2xl">📝</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay tareas</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primera tarea</p>
          <div className="animate-bounce">
            <span className="text-blue-500 text-lg">👇</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full md:w-[60%] border border-gray-300 rounded-xl h-[70vh] p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Mis Tareas</h2>
          <p className="text-sm text-gray-500">{tasks.length} tarea{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={getTasks}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            title="Refrescar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-3 overflow-y-auto h-[calc(70vh-100px)] pr-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}