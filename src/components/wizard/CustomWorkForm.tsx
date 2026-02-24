import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X } from 'lucide-react'
import { useWizardStore } from '@/stores/wizard-store'
import { calcCustomWorkCost } from '@/lib/calc'
import { formatPLN, parseInputToGrosze } from '@/lib/format'
import type { WorkUnit } from '@/types/wizard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CustomWorkFormProps {
  roomId: string
}

const UNITS: WorkUnit[] = ['m2', 'mb', 'szt']

export function CustomWorkForm({ roomId }: CustomWorkFormProps) {
  const { t } = useTranslation()
  const addCustomWork = useWizardStore((s) => s.addCustomWork)
  const removeCustomWork = useWizardStore((s) => s.removeCustomWork)
  const rooms = useWizardStore((s) => s.rooms)
  const room = rooms.find((r) => r.id === roomId)

  const [name, setName] = useState('')
  const [unit, setUnit] = useState<WorkUnit>('m2')
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState('')

  const handleAdd = () => {
    if (!name.trim() || !quantity || !unitPrice) return

    addCustomWork(roomId, {
      name: name.trim(),
      unit,
      quantity: parseFloat(quantity) || 0,
      unitPrice: parseInputToGrosze(unitPrice),
    })

    setName('')
    setQuantity('')
    setUnitPrice('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const customWorks = room?.customWorks ?? []

  return (
    <div className="space-y-3">
      {customWorks.length > 0 && (
        <div className="space-y-1">
          {customWorks.map((work) => (
            <div
              key={work.id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed px-3 py-2"
            >
              <span className="text-sm font-medium">{work.name}</span>
              <Badge variant="outline" className="text-xs">
                {work.quantity} {t(`dimensions.unit.${work.unit}` as never)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatPLN(work.unitPrice)}/{t(`dimensions.unit.${work.unit}` as never)}
              </span>
              <span className="ml-auto text-sm font-semibold text-brand">
                {formatPLN(calcCustomWorkCost(work))}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-destructive hover:text-destructive"
                onClick={() => removeCustomWork(roomId, work.id)}
                aria-label={t('rooms.remove' as never)}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            {t('works.customName' as never)}
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('works.customName' as never)}
            className="w-36"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            {t('works.customUnit' as never)}
          </label>
          <div className="flex gap-1">
            {UNITS.map((u) => (
              <Button
                key={u}
                variant={unit === u ? 'default' : 'outline'}
                size="sm"
                className={
                  unit === u
                    ? 'bg-brand text-brand-foreground hover:bg-brand/90'
                    : undefined
                }
                onClick={() => setUnit(u)}
              >
                {t(`dimensions.unit.${u}` as never)}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            {t('works.customQuantity' as never)}
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0"
            className="w-20"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            {t('works.unitPrice' as never)}
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0,00"
            className="w-24"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={!name.trim() || !quantity || !unitPrice}
        >
          <Plus className="size-3.5" />
          {t('works.addCustom' as never)}
        </Button>
      </div>
    </div>
  )
}
