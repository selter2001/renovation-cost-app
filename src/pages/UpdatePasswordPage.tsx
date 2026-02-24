import { useTranslation } from 'react-i18next'
import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function UpdatePasswordPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-md border-border/50 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">
            {t('auth.updatePassword')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UpdatePasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
