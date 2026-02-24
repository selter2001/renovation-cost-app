import { useTranslation } from 'react-i18next'
import { AnimatePresence } from 'motion/react'
import useSound from 'use-sound'
import type { LucideIcon } from 'lucide-react'
import {
  CookingPot,
  Bath,
  Sofa,
  Bed,
  DoorOpen,
  Monitor,
  LayoutGrid,
} from 'lucide-react'
import { useWizardStore } from '@/stores/wizard-store'
import { ROOM_TYPES } from '@/types/wizard'
import { Card } from '@/components/ui/card'
import { RoomCard } from '@/components/wizard/RoomCard'

const ICON_MAP: Record<string, LucideIcon> = {
  CookingPot,
  Bath,
  Sofa,
  Bed,
  DoorOpen,
  Monitor,
  LayoutGrid,
}

export function RoomsStep() {
  const { t } = useTranslation()
  const rooms = useWizardStore((s) => s.rooms)
  const addRoom = useWizardStore((s) => s.addRoom)
  const [playPop] = useSound('/sounds/pop.mp3', { volume: 0.5 })

  const handleAddRoom = (type: (typeof ROOM_TYPES)[number]) => {
    addRoom(type.type, t(type.labelKey as never))
    playPop()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-2xl font-bold">
          {t('wizard.steps.rooms')}
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {t('rooms.selectType')}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ROOM_TYPES.map((roomType) => {
            const Icon = ICON_MAP[roomType.icon] ?? LayoutGrid
            return (
              <Card
                key={roomType.type}
                className="cursor-pointer items-center justify-center gap-2 p-4 transition-transform hover:scale-[1.02] hover:border-brand/50"
                onClick={() => handleAddRoom(roomType)}
              >
                <Icon className="size-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {t(roomType.labelKey as never)}
                </span>
              </Card>
            )
          })}
        </div>
      </div>

      <div>
        {rooms.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            {t('rooms.empty')}
          </p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
