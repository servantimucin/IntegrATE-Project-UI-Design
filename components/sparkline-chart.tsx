"use client"

import { LineChart, Line, ResponsiveContainer } from "recharts"

interface SparklineChartProps {
  data: number[]
  color?: string
}

export function SparklineChart({ data, color = "hsl(var(--primary))" }: SparklineChartProps) {
  const chartData = data.map((value, index) => ({
    name: `Point ${index}`,
    value: value,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
