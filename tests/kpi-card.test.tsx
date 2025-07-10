import { render, screen } from "@testing-library/react"
import { KpiCard } from "@/components/kpi-card"
import { describe, it, expect, vi } from "vitest"

// Mock the AnimatedCounter and SparklineChart components as they are client components
// and might have issues in a pure JSDOM environment without full React Spring/Recharts setup.
vi.mock("@/components/animated-counter", () => ({
  AnimatedCounter: ({ value, suffix }: { value: number; suffix?: string }) => (
    <span>
      {value}
      {suffix}
    </span>
  ),
}))

vi.mock("@/components/sparkline-chart", () => ({
  SparklineChart: () => <div data-testid="sparkline-chart" />,
}))

describe("KpiCard", () => {
  it("renders title and value correctly", () => {
    render(<KpiCard title="Total Messages" value={12345} />)
    expect(screen.getByText("Total Messages")).toBeInTheDocument()
    expect(screen.getByText("12345")).toBeInTheDocument()
  })

  it("renders animated value with suffix", () => {
    render(<KpiCard title="Total Messages" value={12345} isAnimated unit="units" />)
    expect(screen.getByText("12345units")).toBeInTheDocument()
  })

  it("applies critical styling", () => {
    render(<KpiCard title="Critical Errors" value={42} isCritical />)
    const valueElement = screen.getByText("42")
    expect(valueElement).toHaveClass("text-red-500")
  })

  it("renders sparkline chart when data is provided", () => {
    render(<KpiCard title="Success Rate" value={98.5} unit="%" sparklineData={[1, 2, 3]} />)
    expect(screen.getByTestId("sparkline-chart")).toBeInTheDocument()
  })

  it("does not render sparkline chart when data is empty", () => {
    render(<KpiCard title="Success Rate" value={98.5} unit="%" sparklineData={[]} />)
    expect(screen.queryByTestId("sparkline-chart")).not.toBeInTheDocument()
  })
})
