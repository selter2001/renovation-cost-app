import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useWizardStore } from '@/stores/wizard-store'
import { useAuthStore } from '@/stores/auth-store'
import { supabase } from '@/lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SaveEstimateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingEstimateId?: string
  existingName?: string
  onSaved?: () => void
}

export function SaveEstimateDialog({
  open,
  onOpenChange,
  existingEstimateId,
  existingName,
  onSaved,
}: SaveEstimateDialogProps) {
  const { t } = useTranslation()
  const session = useAuthStore((s) => s.session)
  const [name, setName] = useState(existingName ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isUpdate = !!existingEstimateId

  useEffect(() => {
    if (open) {
      setName(existingName ?? '')
      setError(null)
      setSuccess(null)
      setSaving(false)
    }
  }, [open, existingName])

  async function handleSave() {
    if (!name.trim()) return
    if (!session?.user) return

    if (!supabase) { setError(t('estimates.errors.saveFailed' as never)); return }

    setSaving(true)
    setError(null)
    setSuccess(null)

    const { rooms, vatRate } = useWizardStore.getState()

    try {
      if (isUpdate) {
        const { error: updateError } = await supabase
          .from('quotes')
          .update({ name: name.trim(), data: { rooms, vatRate } })
          .eq('id', existingEstimateId)

        if (updateError) throw updateError

        setSuccess(t('estimates.updated' as never))
      } else {
        const { error: insertError } = await supabase
          .from('quotes')
          .insert({
            user_id: session.user.id,
            name: name.trim(),
            data: { rooms, vatRate },
          })

        if (insertError) throw insertError

        setSuccess(t('estimates.saved' as never))
      }

      onSaved?.()

      setTimeout(() => {
        onOpenChange(false)
      }, 800)
    } catch {
      setError(t('estimates.errors.saveFailed' as never))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? t('estimates.updateButton' as never) : t('estimates.save' as never)}
          </DialogTitle>
          <DialogDescription>
            {t('estimates.name' as never)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="estimate-name">{t('estimates.name' as never)}</Label>
            <Input
              id="estimate-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('estimates.namePlaceholder' as never)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleSave()
                }
              }}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            {isUpdate ? t('estimates.updateButton' as never) : t('estimates.saveButton' as never)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
