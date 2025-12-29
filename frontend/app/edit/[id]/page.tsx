"use client"

import { useParams } from "next/navigation"
import TaskForm from "@/components/TaskForm"

export default function EditTaskPage() {
  const params = useParams()
  const id = params.id as string

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Formulario de edición - pasa el ID como prop */}
      <TaskForm taskId={id} />
      
      {/* Lista de tareas (puedes incluirla o no) */}
      {/* <TaskList /> */}
    </div>
  )
}