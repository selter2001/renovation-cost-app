import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Trash2, Pencil } from 'lucide-react'
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
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { Room } from '@/types/wizard'

const ICON_MAP: Record<string, LucideIcon> = {
  CookingPot,
  Bath,
  Sofa,
  Bed,
  DoorOpen,
  Monitor,
  LayoutGrid,
}

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  const { t } = useTranslation()
  const removeRoom = useWizardStore((s) => s.removeRoom)
  const updateRoomName = useWizardStore((s) => s.updateRoomName)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState(room.name)

  const iconName =
    { kitchen: 'CookingPot', bathroom: 'Bath', living: 'Sofa', bedroom: 'Bed', hallway: 'DoorOpen', office: 'Monitor', other: 'LayoutGrid' }[room.type] ?? 'LayoutGrid'
  const Icon = ICON_MAP[iconName] ?? LayoutGrid

  const handleSave = () => {
    if (editName.trim()) {
      updateRoomName(room.id, editName.trim())
    }
    setEditOpen(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="flex-row items-center gap-3 px-4 py-3">
        <Icon className="size-5 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate font-medium">{room.name}</span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => {
            setEditName(room.name)
            setEditOpen(true)
          }}
          aria-label={t('rooms.edit')}
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-destructive hover:text-destructive"
          onClick={() => removeRoom(room.id)}
          aria-label={t('rooms.remove')}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('rooms.editTitle')}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <label className="text-sm font-medium" htmlFor="room-name">
              {t('rooms.nameLabel')}
            </label>
            <Input
              id="room-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
              }}
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              {t('rooms.cancel')}
            </Button>
            <Button onClick={handleSave}>{t('rooms.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
