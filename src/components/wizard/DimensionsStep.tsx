import { useTranslation } from 'react-i18next'
import { Plus, X } from 'lucide-react'
import { useWizardStore } from '@/stores/wizard-store'
import { calcRoomNetArea } from '@/lib/calc'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function DimensionsStep() {
  const { t } = useTranslation()
  const rooms = useWizardStore((s) => s.rooms)
  const updateDimension = useWizardStore((s) => s.updateDimension)

  const parseNum = (val: string): number => {
    const n = parseFloat(val)
    return isNaN(n) ? 0 : n
  }

  const handleArrayUpdate = (
    roomId: string,
    field: 'walls' | 'ceilings',
    arr: number[],
    index: number,
    value: string,
  ) => {
    const newArr = [...arr]
    newArr[index] = parseNum(value)
    updateDimension(roomId, field, newArr)
  }

  const handleArrayAdd = (
    roomId: string,
    field: 'walls' | 'ceilings',
    arr: number[],
  ) => {
    updateDimension(roomId, field, [...arr, 0])
  }

  const handleArrayRemove = (
    roomId: string,
    field: 'walls' | 'ceilings',
    arr: number[],
    index: number,
  ) => {
    const newArr = arr.filter((_, i) => i !== index)
    updateDimension(roomId, field, newArr)
  }

  if (rooms.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {t('rooms.empty')}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('wizard.steps.dimensions')}</h2>

      {rooms.map((room) => {
        const netArea = calcRoomNetArea(room)
        return (
          <Card key={room.id} className="gap-4 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{room.name}</h3>
              <Badge variant="secondary">
                {t('dimensions.netArea')}: {netArea.toFixed(2)}{' '}
                {t('dimensions.unit.m2')}
              </Badge>
            </div>

            {/* Walls */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {t('dimensions.walls')}
                </span>
                <Badge variant="outline">{room.dimensions.walls.length}</Badge>
              </div>
              {room.dimensions.walls.map((val, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-20 text-xs text-muted-foreground">
                    {t('dimensions.wall')} {i + 1}
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={val || ''}
                    onChange={(e) =>
                      handleArrayUpdate(
                        room.id,
                        'walls',
                        room.dimensions.walls,
                        i,
                        e.target.value,
                      )
                    }
                    placeholder={t('dimensions.unit.m2')}
                    className="w-28"
                  />
                  <span className="text-xs text-muted-foreground">
                    {t('dimensions.unit.m2')}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-destructive hover:text-destructive"
                    onClick={() =>
                      handleArrayRemove(
                        room.id,
                        'walls',
                        room.dimensions.walls,
                        i,
                      )
                    }
                    aria-label={t('dimensions.removeWall')}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleArrayAdd(room.id, 'walls', room.dimensions.walls)
                }
              >
                <Plus className="size-3.5" />
                {t('dimensions.addWall')}
              </Button>
            </div>

            {/* Ceilings */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {t('dimensions.ceilings')}
                </span>
                <Badge variant="outline">
                  {room.dimensions.ceilings.length}
                </Badge>
              </div>
              {room.dimensions.ceilings.map((val, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-20 text-xs text-muted-foreground">
                    {t('dimensions.ceiling')} {i + 1}
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={val || ''}
                    onChange={(e) =>
                      handleArrayUpdate(
                        room.id,
                        'ceilings',
                        room.dimensions.ceilings,
                        i,
                        e.target.value,
                      )
                    }
                    placeholder={t('dimensions.unit.m2')}
                    className="w-28"
                  />
                  <span className="text-xs text-muted-foreground">
                    {t('dimensions.unit.m2')}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-destructive hover:text-destructive"
                    onClick={() =>
                      handleArrayRemove(
                        room.id,
                        'ceilings',
                        room.dimensions.ceilings,
                        i,
                      )
                    }
                    aria-label={t('dimensions.removeCeiling')}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleArrayAdd(
                    room.id,
                    'ceilings',
                    room.dimensions.ceilings,
                  )
                }
              >
                <Plus className="size-3.5" />
                {t('dimensions.addCeiling')}
              </Button>
            </div>

            {/* Single value dimensions */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Floor */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {t('dimensions.floor')}
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={room.dimensions.floor || ''}
                    onChange={(e) =>
                      updateDimension(
                        room.id,
                        'floor',
                        parseNum(e.target.value),
                      )
                    }
                    placeholder={t('dimensions.unit.m2')}
                  />
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {t('dimensions.unit.m2')}
                  </span>
                </div>
              </div>

              {/* Corners */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {t('dimensions.corners')}
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={room.dimensions.corners || ''}
                    onChange={(e) =>
                      updateDimension(
                        room.id,
                        'corners',
                        parseNum(e.target.value),
                      )
                    }
                    placeholder={t('dimensions.unit.mb')}
                  />
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {t('dimensions.unit.mb')}
                  </span>
                </div>
              </div>

              {/* Grooves */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {t('dimensions.grooves')}
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={room.dimensions.grooves || ''}
                    onChange={(e) =>
                      updateDimension(
                        room.id,
                        'grooves',
                        parseNum(e.target.value),
                      )
                    }
                    placeholder={t('dimensions.unit.mb')}
                  />
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {t('dimensions.unit.mb')}
                  </span>
                </div>
              </div>

              {/* Acrylic */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {t('dimensions.acrylic')}
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={room.dimensions.acrylic || ''}
                    onChange={(e) =>
                      updateDimension(
                        room.id,
                        'acrylic',
                        parseNum(e.target.value),
                      )
                    }
                    placeholder={t('dimensions.unit.mb')}
                  />
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {t('dimensions.unit.mb')}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
