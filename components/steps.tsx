import { cn } from "@/lib/utils"
import { CheckCircle, Circle } from "lucide-react"

interface Step {
  id: string | number
  label: string
  status: "completed" | "current" | "upcoming"
}

interface StepsProps {
  steps: Step[]
}

export function Steps({ steps }: StepsProps) {
  return (
    <ol className="relative border-l border-gray-200 dark:border-gray-700">
      {steps.map((step, index) => (
        <li key={step.id} className="mb-10 ml-6">
          <span
            className={cn(
              "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-8 ring-background",
              {
                "bg-green-500": step.status === "completed",
                "bg-primary": step.status === "current",
                "bg-gray-300": step.status === "upcoming",
              },
            )}
          >
            {step.status === "completed" ? (
              <CheckCircle className="h-4 w-4 text-white" />
            ) : (
              <Circle className="h-4 w-4 text-white" />
            )}
          </span>
          <h3
            className={cn("flex items-center text-lg font-semibold text-gray-900 dark:text-white", {
              "text-primary": step.status === "current",
              "text-gray-500": step.status === "upcoming",
            })}
          >
            {step.label}
            {step.status === "current" && (
              <span className="mr-2 ml-3 rounded bg-primary-foreground px-2.5 py-0.5 text-sm font-medium text-primary dark:bg-primary dark:text-primary-foreground">
                Current
              </span>
            )}
          </h3>
        </li>
      ))}
    </ol>
  )
}
