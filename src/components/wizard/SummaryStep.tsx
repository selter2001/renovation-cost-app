import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWizardStore } from '@/stores/wizard-store'
import { PREDEFINED_WORKS, ROOM_TYPES } from '@/types/wizard'
import {
  getWorkQuantity,
  calcWorkCost,
  calcCustomWorkCost,
  calcRoomTotal,
  calcNetTotal,
  calcVat,
  calcGrossFromNet,
} from '@/lib/calc'
import { formatPLN } from '@/lib/format'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PdfDownloadButton } from '@/components/pdf/PdfDownloadButton'
import type { LucideIcon } from 'lucide-react'
import {
  CookingPot,
  Bath,
  Sofa,
  Bed,
  DoorOpen,
  Monitor,
  LayoutGrid,
  FileDown,
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

export function SummaryStep() {
  const { t } = useTranslation()
  const rooms = useWizardStore((s) => s.rooms)
  const vatRate = useWizardStore((s) => s.vatRate)
  const [pdfFormat, setPdfFormat] = useState<'standard' | 'tabular'>(
    'standard'
  )

  if (rooms.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {t('summary.noRooms' as never)}
      </div>
    )
  }

  const net = calcNetTotal(rooms)
  const vat = calcVat(net, vatRate)
  const gross = calcGrossFromNet(net, vatRate)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {t('summary.title' as never)}
      </h2>

      {/* Per room breakdown */}
      {rooms.map((room) => {
        const roomTypeDef = ROOM_TYPES.find((rt) => rt.type === room.type)
        const Icon = roomTypeDef
          ? ICON_MAP[roomTypeDef.icon] ?? LayoutGrid
          : LayoutGrid
        const roomTotal = calcRoomTotal(room)
        const activeWorks = PREDEFINED_WORKS.filter(
          (wt) => room.works[wt.id]?.enabled
        )

        return (
          <Card key={room.id} className="gap-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="size-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">{room.name}</h3>
              </div>
              <Badge variant="secondary" className="text-sm font-semibold">
                {formatPLN(roomTotal)}
              </Badge>
            </div>

            {(activeWorks.length > 0 || room.customWorks.length > 0) && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="pb-1 text-left font-medium">
                        {t('summary.work' as never)}
                      </th>
                      <th className="pb-1 text-right font-medium">
                        {t('works.quantity' as never)}
                      </th>
                      <th className="pb-1 text-right font-medium">
                        {t('works.unitPrice' as never)}
                      </th>
                      <th className="pb-1 text-right font-medium">
                        {t('works.cost' as never)}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeWorks.map((wt) => {
                      const qty = getWorkQuantity(room, wt.id)
                      const price = room.works[wt.id].unitPrice
                      const cost = calcWorkCost(qty, price)
                      return (
                        <tr key={wt.id} className="border-b border-dashed">
                          <td className="py-1.5">
                            {t(wt.labelKey as never)}
                          </td>
                          <td className="py-1.5 text-right text-muted-foreground">
                            {qty.toFixed(2)}{' '}
                            {t(`dimensions.unit.${wt.unit}` as never)}
                          </td>
                          <td className="py-1.5 text-right text-muted-foreground">
                            {formatPLN(price)}
                          </td>
                          <td className="py-1.5 text-right font-medium">
                            {formatPLN(cost)}
                          </td>
                        </tr>
                      )
                    })}
                    {room.customWorks.map((cw) => {
                      const cost = calcCustomWorkCost(cw)
                      return (
                        <tr key={cw.id} className="border-b border-dashed">
                          <td className="py-1.5">{cw.name}</td>
                          <td className="py-1.5 text-right text-muted-foreground">
                            {cw.quantity.toFixed(2)}{' '}
                            {t(`dimensions.unit.${cw.unit}` as never)}
                          </td>
                          <td className="py-1.5 text-right text-muted-foreground">
                            {formatPLN(cw.unitPrice)}
                          </td>
                          <td className="py-1.5 text-right font-medium">
                            {formatPLN(cost)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )
      })}

      {/* Totals section */}
      <Card className="gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            {t('summary.netTotal' as never)}
          </span>
          <span className="text-lg font-medium">{formatPLN(net)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            {t('summary.vat' as never)} {vatRate}%
          </span>
          <span className="text-lg font-medium">{formatPLN(vat)}</span>
        </div>
        <div className="flex items-center justify-between border-t pt-2">
          <span className="text-lg font-bold">
            {t('summary.grossTotal' as never)}
          </span>
          <span className="text-xl font-bold text-brand">
            {formatPLN(gross)}
          </span>
        </div>
      </Card>

      {/* PDF export section */}
      <Card className="gap-3 p-4">
        <div className="flex items-center gap-2">
          <FileDown className="size-5 text-muted-foreground" />
          <span className="font-medium">
            {t('summary.pdfFormat' as never)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1">
            <Button
              variant={pdfFormat === 'standard' ? 'default' : 'outline'}
              size="sm"
              className={
                pdfFormat === 'standard'
                  ? 'bg-brand text-brand-foreground hover:bg-brand/90'
                  : undefined
              }
              onClick={() => setPdfFormat('standard')}
            >
              {t('summary.pdfStandard' as never)}
            </Button>
            <Button
              variant={pdfFormat === 'tabular' ? 'default' : 'outline'}
              size="sm"
              className={
                pdfFormat === 'tabular'
                  ? 'bg-brand text-brand-foreground hover:bg-brand/90'
                  : undefined
              }
              onClick={() => setPdfFormat('tabular')}
            >
              {t('summary.pdfTabular' as never)}
            </Button>
          </div>
          <PdfDownloadButton
            rooms={rooms}
            vatRate={vatRate}
            format={pdfFormat}
          />
        </div>
      </Card>
    </div>
  )
}
