"use client"
import { useSpring, animated } from "@react-spring/web"

interface AnimatedCounterProps {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({
  value,
  duration = 1000,
  decimals = 0,
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 200,
    config: { duration: duration },
  })

  return <animated.span>{number.to((n) => `${prefix}${n.toFixed(decimals)}${suffix}`)}</animated.span>
}
