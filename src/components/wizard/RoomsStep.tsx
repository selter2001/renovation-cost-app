import { useTranslation } from 'react-i18next'

export function RoomsStep() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('wizard.steps.rooms')}</h2>
      <p className="text-muted-foreground">{t('rooms.selectType')}</p>
    </div>
  )
}
