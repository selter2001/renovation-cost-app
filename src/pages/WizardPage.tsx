import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import useSound from 'use-sound'
import { useWizardStore } from '@/stores/wizard-store'
import { WizardProgress } from '@/components/wizard/WizardProgress'
import { WizardNav } from '@/components/wizard/WizardNav'
import { RoomsStep } from '@/components/wizard/RoomsStep'
import { DimensionsStep } from '@/components/wizard/DimensionsStep'
import { WorksStep } from '@/components/wizard/WorksStep'
import { FloatingSummary } from '@/components/wizard/FloatingSummary'

const variants = {
  enter: (direction: string) => ({
    x: direction === 'forward' ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: string) => ({
    x: direction === 'forward' ? -40 : 40,
    opacity: 0,
  }),
}

const STEPS = [RoomsStep, DimensionsStep, WorksStep]

export default function WizardPage() {
  const currentStep = useWizardStore((s) => s.currentStep)
  const nextStep = useWizardStore((s) => s.nextStep)
  const prevStep = useWizardStore((s) => s.prevStep)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.4 })

  const handleNext = useCallback(() => {
    setDirection('forward')
    const newStep = Math.min(currentStep + 1, 3)
    nextStep()
    if (newStep === 3) {
      playSuccess()
    }
  }, [currentStep, nextStep, playSuccess])

  const handlePrev = useCallback(() => {
    setDirection('backward')
    prevStep()
  }, [prevStep])

  const StepComponent = STEPS[currentStep]

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      <WizardProgress currentStep={currentStep} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {StepComponent ? (
            <StepComponent />
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              SummaryStep
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <WizardNav onNext={handleNext} onPrev={handlePrev} />
      <FloatingSummary />
    </div>
  )
}
