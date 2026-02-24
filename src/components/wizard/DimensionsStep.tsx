import { useTranslation } from 'react-i18next'

export function DimensionsStep() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('wizard.steps.dimensions')}</h2>
    </div>
  )
}
