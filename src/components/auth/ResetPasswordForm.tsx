import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ResetPasswordForm() {
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError(t('auth.errors.emailRequired'))
      return
    }

    if (!supabase) { setError(t('auth.errors.generic')); return }

    setIsLoading(true)
    try {
      const redirectTo = window.location.origin + (import.meta.env.BASE_URL || '/') + '#/update-password'

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo },
      )

      if (resetError) {
        setError(t('auth.errors.generic'))
        return
      }

      setIsSent(true)
    } catch {
      setError(t('auth.errors.generic'))
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <CheckCircle2 className="size-12 text-brand" />
        <p className="text-sm text-muted-foreground">{t('auth.resetSent')}</p>
        <a
          href="#/login"
          className="text-sm text-brand underline-offset-4 hover:underline"
        >
          {t('auth.backToLogin')}
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">{t('auth.email')}</Label>
        <Input
          id="reset-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" className="w-full bg-brand text-brand-foreground hover:bg-brand/90" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {t('auth.sendResetLink')}
      </Button>
    </form>
  )
}
