export function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="min-h-screen flex items-start justify-center p-6 pt-12 lg:items-center lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="w-full">
          {children}
        </div>
      </div>
    </main>
  )
}
