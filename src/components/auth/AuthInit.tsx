import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth-store'

interface AuthInitProps {
  children: React.ReactNode
}

export function AuthInit({ children }: AuthInitProps) {
  const isLoading = useAuthStore((s) => s.isLoading)
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // CRITICAL: Keep callback synchronous -- no async here (causes deadlocks)
      setAuth(session?.user ?? null, session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setAuth])

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <svg
          className="h-8 w-8 animate-spin text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    )
  }

  return <>{children}</>
}
