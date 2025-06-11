export function AuthLayout({ children, className = '' }) {
  return (
    <main className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center px-6 pt-12 ${className}`}>
      {children}
    </main>
  )
}
