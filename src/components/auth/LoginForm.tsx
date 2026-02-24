import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function mapAuthError(error: string): string {
  if (error.includes('Invalid login credentials')) return 'auth.errors.invalidCredentials'
  if (error.includes('Email not confirmed')) return 'auth.errors.invalidCredentials'
  return 'auth.errors.generic'
}

export function LoginForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError(t('auth.errors.emailRequired'))
      return
    }
    if (!password || password.length < 6) {
      setError(t('auth.errors.weakPassword'))
      return
    }

    if (!supabase) { setError(t('auth.errors.generic')); return }

    setIsLoading(true)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        setError(t(mapAuthError(authError.message) as never))
        return
      }

      navigate('/')
    } catch {
      setError(t('auth.errors.generic'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">{t('auth.email')}</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">{t('auth.password')}</Label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          minLength={6}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" className="w-full bg-brand text-brand-foreground hover:bg-brand/90" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {t('auth.loginButton')}
      </Button>

      <div className="text-center">
        <a
          href="#/reset-password"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-brand hover:underline"
        >
          {t('auth.forgotPassword')}
        </a>
      </div>
    </form>
  )
}
