import { PDFDownloadLink } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'
import type { Room } from '@/types/wizard'
import { PREDEFINED_WORKS } from '@/types/wizard'
import { Button } from '@/components/ui/button'
import { EstimatePdf } from '@/components/pdf/EstimatePdf'
import { EstimatePdfTabular } from '@/components/pdf/EstimatePdfTabular'

interface PdfDownloadButtonProps {
  rooms: Room[]
  vatRate: 8 | 23
  format: 'standard' | 'tabular'
}

export function PdfDownloadButton({
  rooms,
  vatRate,
  format,
}: PdfDownloadButtonProps) {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === 'en' ? 'en' : 'pl') as 'pl' | 'en'

  // Pre-resolve all translations as plain strings (PDF worker cannot use hooks/context)
  const pdfTranslations: Record<string, string> = {
    title: t('summary.title' as never),
    room: t('summary.room' as never),
    work: t('summary.work' as never),
    subtotal: t('summary.subtotal' as never),
    netTotal: t('summary.netTotal' as never),
    vat: t('summary.vat' as never),
    grossTotal: t('summary.grossTotal' as never),
    quantity: t('works.quantity' as never),
    unitPrice: t('works.unitPrice' as never),
    unitLabel: t('works.customUnit' as never),
    costLabel: t('works.cost' as never),
    // Unit labels
    unit_m2: t('dimensions.unit.m2' as never),
    unit_mb: t('dimensions.unit.mb' as never),
    unit_szt: t('dimensions.unit.szt' as never),
  }

  // Work type labels
  for (const wt of PREDEFINED_WORKS) {
    pdfTranslations[`work_${wt.id}`] = t(wt.labelKey as never)
  }

  const PdfComponent = format === 'standard' ? EstimatePdf : EstimatePdfTabular

  const doc = (
    <PdfComponent
      rooms={rooms}
      vatRate={vatRate}
      language={lang}
      translations={pdfTranslations}
    />
  )

  const fileName = `wycena-${new Date().toISOString().slice(0, 10)}.pdf`

  return (
    <PDFDownloadLink document={doc} fileName={fileName}>
      {({ loading, error }) => (
        <Button
          disabled={loading || !!error}
          className="bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {loading
            ? t('summary.pdfGenerating' as never)
            : error
              ? 'Error'
              : t('summary.exportPdf' as never)}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
