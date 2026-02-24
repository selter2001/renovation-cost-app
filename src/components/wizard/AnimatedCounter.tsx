import { useEffect } from 'react'
import { useSpring, useTransform, motion } from 'motion/react'

interface AnimatedCounterProps {
  value: number
  locale?: string
}

export function AnimatedCounter({
  value,
  locale = 'pl-PL',
}: AnimatedCounterProps) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 })

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  const display = useTransform(spring, (v) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
    }).format(v / 100),
  )

  return <motion.span>{display}</motion.span>
}
