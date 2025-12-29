"use client"

import { TaskProvider } from "@/context/task.context"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <TaskProvider>
          <div className="p-8 md:p-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <header className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">TaskMaster</h1>
                    <p className="text-gray-600">Gestiona tus tareas de manera eficiente</p>
                  </div>
                  
                </div>
              </header>
              
              {children}
              
              {/* Footer */}
              <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
                <p>© 2025 TaskMaster - Totalmente funcional </p>
              </footer>
            </div>
          </div>
        </TaskProvider>
      </body>
    </html>
  )
}