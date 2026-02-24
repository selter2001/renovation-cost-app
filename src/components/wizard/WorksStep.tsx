import { useTranslation } from 'react-i18next'
import { useWizardStore } from '@/stores/wizard-store'
import { PREDEFINED_WORKS, ROOM_TYPES } from '@/types/wizard'
import { calcRoomTotal } from '@/lib/calc'
import { formatPLN } from '@/lib/format'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WorkRow } from '@/components/wizard/WorkRow'
import { CustomWorkForm } from '@/components/wizard/CustomWorkForm'
import type { LucideIcon } from 'lucide-react'
import {
  CookingPot,
  Bath,
  Sofa,
  Bed,
  DoorOpen,
  Monitor,
  LayoutGrid,
  Wrench,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  CookingPot,
  Bath,
  Sofa,
  Bed,
  DoorOpen,
  Monitor,
  LayoutGrid,
}

export function WorksStep() {
  const { t } = useTranslation()
  const rooms = useWizardStore((s) => s.rooms)

  if (rooms.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {t('rooms.empty')}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('wizard.steps.works')}</h2>

      {rooms.map((room) => {
        const roomTypeDef = ROOM_TYPES.find((rt) => rt.type === room.type)
        const Icon = roomTypeDef
          ? ICON_MAP[roomTypeDef.icon] ?? LayoutGrid
          : LayoutGrid
        const roomTotal = calcRoomTotal(room)

        return (
          <Card key={room.id} className="gap-4 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="size-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">{room.name}</h3>
              </div>
              <Badge variant="secondary" className="text-sm">
                {t('summary.subtotal' as never)}: {formatPLN(roomTotal)}
              </Badge>
            </div>

            <div className="space-y-2">
              {PREDEFINED_WORKS.map((workType) => (
                <WorkRow
                  key={workType.id}
                  room={room}
                  workType={workType}
                  roomWork={room.works[workType.id]}
                />
              ))}
            </div>

            <div className="border-t pt-3">
              <div className="mb-2 flex items-center gap-2">
                <Wrench className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {t('works.addCustom' as never)}
                </span>
              </div>
              <CustomWorkForm roomId={room.id} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
