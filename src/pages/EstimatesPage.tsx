import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/stores/auth-store'
import { useWizardStore } from '@/stores/wizard-store'
import { EstimatesList } from '@/components/estimates/EstimatesList'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function EstimatesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, isLoading, navigate])

  if (isLoading || !user) return null

  function handleNewEstimate() {
    useWizardStore.getState().resetWizard()
    navigate('/wizard')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 rounded-2xl border border-border/50 bg-card/80 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">{t('estimates.title' as never)}</h1>
          <Button
            size="sm"
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={handleNewEstimate}
          >
            <Plus className="size-4" />
            {t('estimates.newEstimate' as never)}
          </Button>
        </div>
      </div>

      <EstimatesList />
    </div>
  )
}
