import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { supabase } from '@/lib/supabase'
import { useLoadEstimate, useDeleteEstimate } from './EstimateActions'
import { SaveEstimateDialog } from './SaveEstimateDialog'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FolderOpen, Trash2, Upload, RefreshCw, Loader2 } from 'lucide-react'
import type { QuoteData } from '@/types/database'

interface Estimate {
  id: string
  name: string
  data: QuoteData
  created_at: string
  updated_at: string
}

export function EstimatesList() {
  const { t, i18n } = useTranslation()
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [overwriteEstimate, setOverwriteEstimate] = useState<{ id: string; name: string } | null>(null)

  const loadEstimate = useLoadEstimate()
  const deleteEstimate = useDeleteEstimate()

  const fetchEstimates = useCallback(async () => {
    if (!supabase) { setLoading(false); return }

    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('quotes')
      .select('id, name, data, created_at, updated_at')
      .order('updated_at', { ascending: false })

    if (fetchError) {
      setError(t('estimates.errors.loadFailed' as never))
      setLoading(false)
      return
    }

    setEstimates((data ?? []) as Estimate[])
    setLoading(false)
  }, [t])

  useEffect(() => {
    fetchEstimates()
  }, [fetchEstimates])

  async function handleLoad(id: string) {
    setLoadingId(id)
    try {
      await loadEstimate(id)
    } catch {
      setError(t('estimates.errors.loadFailed' as never))
    } finally {
      setLoadingId(null)
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(t('estimates.deleteConfirm' as never))
    if (!confirmed) return

    setDeletingId(id)
    try {
      await deleteEstimate(id)
      setEstimates((prev) => prev.filter((e) => e.id !== id))
    } catch {
      setError(t('estimates.errors.deleteFailed' as never))
    } finally {
      setDeletingId(null)
    }
  }

  function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat(i18n.language === 'pl' ? 'pl-PL' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr))
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="mb-4 text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchEstimates}>
          <RefreshCw className="mr-2 size-4" />
          {t('common.loading' as never)}
        </Button>
      </div>
    )
  }

  if (estimates.length === 0) {
    return (
      <div className="py-12 text-center">
        <FolderOpen className="mx-auto mb-4 size-12 text-muted-foreground/50" />
        <p className="mb-4 text-muted-foreground">{t('estimates.empty' as never)}</p>
        <Link to="/wizard">
          <Button variant="outline">{t('home.cta' as never)}</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {estimates.map((estimate) => {
          const roomCount = estimate.data?.rooms?.length ?? 0

          return (
            <Card key={estimate.id} className="gap-0 py-0">
              <div className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{estimate.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{t('estimates.rooms' as never, { count: roomCount })}</span>
                    <span>{formatDate(estimate.updated_at)}</span>
                  </div>
                </div>

                <div className="ml-3 flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title={t('estimates.load' as never)}
                    onClick={() => handleLoad(estimate.id)}
                    disabled={loadingId === estimate.id}
                  >
                    {loadingId === estimate.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <FolderOpen className="size-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title={t('estimates.updateButton' as never)}
                    onClick={() => setOverwriteEstimate({ id: estimate.id, name: estimate.name })}
                  >
                    <Upload className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title={t('estimates.delete' as never)}
                    onClick={() => handleDelete(estimate.id)}
                    disabled={deletingId === estimate.id}
                    className="text-destructive hover:text-destructive"
                  >
                    {deletingId === estimate.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <SaveEstimateDialog
        open={!!overwriteEstimate}
        onOpenChange={(open) => {
          if (!open) setOverwriteEstimate(null)
        }}
        existingEstimateId={overwriteEstimate?.id}
        existingName={overwriteEstimate?.name}
        onSaved={fetchEstimates}
      />
    </>
  )
}
