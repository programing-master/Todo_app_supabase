"use client"

import TaskForm from "@/components/TaskForm"
import TaskList from "@/components/TaskList"

export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Formulario para crear nuevas tareas */}
      <TaskForm />
      
      {/* Lista de tareas */}
      <TaskList />
    </div>
  )
}