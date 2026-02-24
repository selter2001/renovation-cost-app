import { useTranslation } from 'react-i18next'
import { useWizardStore } from '@/stores/wizard-store'
import { getWorkQuantity, calcWorkCost } from '@/lib/calc'
import { formatPLN, parseInputToGrosze } from '@/lib/format'
import type { Room, WorkType, RoomWork } from '@/types/wizard'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'

interface WorkRowProps {
  room: Room
  workType: WorkType
  roomWork: RoomWork | undefined
}

export function WorkRow({ room, workType, roomWork }: WorkRowProps) {
  const { t } = useTranslation()
  const toggleWork = useWizardStore((s) => s.toggleWork)
  const setWorkPrice = useWizardStore((s) => s.setWorkPrice)

  const enabled = roomWork?.enabled ?? false
  const unitPrice = roomWork?.unitPrice ?? 0
  const quantity = getWorkQuantity(room, workType.id)
  const cost = enabled ? calcWorkCost(quantity, unitPrice) : 0

  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2 transition-opacity ${
        enabled ? 'opacity-100' : 'opacity-50'
      }`}
    >
      <Switch
        checked={enabled}
        onCheckedChange={() => toggleWork(room.id, workType.id)}
        aria-label={
          enabled
            ? t('works.enabled' as never)
            : t('works.disabled' as never)
        }
      />

      <span className="min-w-[120px] text-sm font-medium">
        {t(workType.labelKey as never)}
      </span>

      <span className="text-xs text-muted-foreground">
        {quantity.toFixed(2)} {t(`dimensions.unit.${workType.unit}` as never)}
      </span>

      <div className="flex items-center gap-1">
        <Input
          type="number"
          step="0.01"
          min="0"
          disabled={!enabled}
          value={unitPrice ? (unitPrice / 100).toFixed(2) : ''}
          onChange={(e) => {
            const grosze = parseInputToGrosze(e.target.value)
            setWorkPrice(room.id, workType.id, grosze)
          }}
          placeholder="0,00"
          className="w-24"
          aria-label={t('works.unitPrice' as never)}
        />
        <span className="text-xs text-muted-foreground">
          {t('works.unitPrice' as never)}
        </span>
      </div>

      {enabled && unitPrice > 0 && (
        <span className="ml-auto text-sm font-semibold text-brand">
          {formatPLN(cost)}
        </span>
      )}
    </div>
  )
}
