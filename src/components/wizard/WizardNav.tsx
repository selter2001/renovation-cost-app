import { useTranslation } from 'react-i18next'
import { useWizardStore } from '@/stores/wizard-store'
import { Button } from '@/components/ui/button'

interface WizardNavProps {
  onNext: () => void
  onPrev: () => void
}

export function WizardNav({ onNext, onPrev }: WizardNavProps) {
  const { t } = useTranslation()
  const currentStep = useWizardStore((s) => s.currentStep)
  const rooms = useWizardStore((s) => s.rooms)

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === 3

  const isNextDisabled = currentStep === 0 && rooms.length === 0

  return (
    <div className="flex justify-between pt-4">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={isFirstStep}
      >
        {t('wizard.prev')}
      </Button>
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        className={
          isLastStep
            ? undefined
            : 'bg-brand text-brand-foreground hover:bg-brand/90'
        }
      >
        {isLastStep ? t('wizard.finish') : t('wizard.next')}
      </Button>
    </div>
  )
}
