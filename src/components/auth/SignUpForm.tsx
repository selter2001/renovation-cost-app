import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function mapSignUpError(error: string): string {
  if (error.includes('already registered') || error.includes('already been registered')) return 'auth.errors.emailTaken'
  if (error.includes('Password should be at least')) return 'auth.errors.weakPassword'
  return 'auth.errors.generic'
}

export function SignUpForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordsMismatch'))
      return
    }

    if (!supabase) { setError(t('auth.errors.generic')); return }

    setIsLoading(true)
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (authError) {
        setError(t(mapSignUpError(authError.message) as never))
        return
      }

      // With autoconfirm ON, user is immediately logged in
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
        <Label htmlFor="signup-email">{t('auth.email')}</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">{t('auth.password')}</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password">{t('auth.confirmPassword')}</Label>
        <Input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={6}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" className="w-full bg-brand text-brand-foreground hover:bg-brand/90" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {t('auth.signupButton')}
      </Button>
    </form>
  )
}
