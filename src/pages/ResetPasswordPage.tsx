import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResetPasswordPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-md border-border/50 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">
            {t('auth.resetPassword')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResetPasswordForm />
          <div className="text-center">
            <a
              href="#/login"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-brand hover:underline"
            >
              <ArrowLeft className="size-3" />
              {t('auth.backToLogin')}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
