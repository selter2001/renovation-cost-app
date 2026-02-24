import { useTranslation } from 'react-i18next'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const WIZARD_STEPS = [
  'wizard.steps.rooms',
  'wizard.steps.dimensions',
  'wizard.steps.works',
  'wizard.steps.summary',
] as const

interface WizardProgressProps {
  currentStep: number
}

export function WizardProgress({ currentStep }: WizardProgressProps) {
  const { t } = useTranslation()
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100

  return (
    <div className="space-y-3">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between">
        {WIZARD_STEPS.map((stepKey, index) => (
          <div key={stepKey} className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                'flex size-7 items-center justify-center rounded-full text-xs font-medium transition-colors',
                index < currentStep &&
                  'bg-primary text-primary-foreground',
                index === currentStep &&
                  'bg-brand text-brand-foreground',
                index > currentStep && 'bg-muted text-muted-foreground',
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                'text-xs transition-colors',
                index < currentStep && 'text-foreground/70',
                index === currentStep && 'font-medium text-foreground',
                index > currentStep && 'text-muted-foreground',
              )}
            >
              {t(stepKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
