import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { useWizardStore } from '@/stores/wizard-store'
import { calcNetTotal, calcVat, calcGrossFromNet } from '@/lib/calc'
import { Button } from '@/components/ui/button'
import { AnimatedCounter } from '@/components/wizard/AnimatedCounter'

export function FloatingSummary() {
  const { t } = useTranslation()
  const rooms = useWizardStore((s) => s.rooms)
  const vatRate = useWizardStore((s) => s.vatRate)
  const setVatRate = useWizardStore((s) => s.setVatRate)

  const net = calcNetTotal(rooms)
  const vat = calcVat(net, vatRate)
  const gross = calcGrossFromNet(net, vatRate)

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-lg"
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:block">
            <span className="text-xs text-muted-foreground">
              {t('summary.netTotal')}
            </span>
            <p className="text-sm font-medium">
              <AnimatedCounter value={net} />
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs text-muted-foreground">
              {t('summary.vat')} {vatRate}%
            </span>
            <p className="text-sm font-medium">
              <AnimatedCounter value={vat} />
            </p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">
              {t('summary.grossTotal')}
            </span>
            <p className="text-base font-bold">
              <AnimatedCounter value={gross} />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={vatRate === 8 ? 'default' : 'outline'}
            className={
              vatRate === 8
                ? 'bg-brand text-brand-foreground hover:bg-brand/90'
                : undefined
            }
            onClick={() => setVatRate(8)}
          >
            8%
          </Button>
          <Button
            size="sm"
            variant={vatRate === 23 ? 'default' : 'outline'}
            className={
              vatRate === 23
                ? 'bg-brand text-brand-foreground hover:bg-brand/90'
                : undefined
            }
            onClick={() => setVatRate(23)}
          >
            23%
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
