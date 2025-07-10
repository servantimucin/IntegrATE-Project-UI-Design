import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/animated-counter"
import { SparklineChart } from "@/components/sparkline-chart"

interface KpiCardProps {
  title: string
  value: number | string
  unit?: string
  isAnimated?: boolean
  isCritical?: boolean
  sparklineData?: number[]
}

export function KpiCard({ title, value, unit, isAnimated = false, isCritical = false, sparklineData }: KpiCardProps) {
  return (
    <Card className="w-[200px] h-[120px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1">
        <div className={isCritical ? "text-red-500 text-2xl font-bold" : "text-2xl font-bold"}>
          {isAnimated ? <AnimatedCounter value={value as number} suffix={unit} /> : `${value}${unit || ""}`}
        </div>
        {sparklineData && sparklineData.length > 0 && (
          <div className="h-10 w-full">
            <SparklineChart data={sparklineData} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
