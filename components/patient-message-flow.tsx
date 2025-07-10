import { cn } from "@/lib/utils"
import type { Message, MessageStatus } from "@/lib/api"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface PatientMessageFlowProps {
  messages: Message[]
}

const StatusPill = ({ status }: { status: MessageStatus }) => {
  let colorClass = ""
  let Icon = null
  switch (status) {
    case "success":
      colorClass = "bg-green-100 text-green-800"
      Icon = CheckCircle
      break
    case "error":
      colorClass = "bg-red-100 text-red-800"
      Icon = XCircle
      break
    case "pending":
      colorClass = "bg-yellow-100 text-yellow-800"
      Icon = Clock
      break
    default:
      colorClass = "bg-gray-100 text-gray-800"
  }
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", colorClass)}>
      {Icon && <Icon className="mr-1 h-3 w-3" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export function PatientMessageFlow({ messages }: PatientMessageFlowProps) {
  return (
    <div className="relative pl-6 border-l-2 border-gray-200 max-h-[400px] overflow-y-auto">
      {messages.map((message, index) => (
        <div key={message.id} className="mb-8 flex items-start">
          <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-8 ring-white">
            <div className="h-3 w-3 rounded-full bg-gray-400" />
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">{message.event}</p>
              <time className="text-xs text-gray-500">{message.timestamp}</time>
            </div>
            <div className="mt-1 text-sm text-gray-700">
              <p>
                {message.patient} - {message.facility}
              </p>
              {message.errorMessage && <p className="text-red-600">Error: {message.errorMessage}</p>}
            </div>
            <div className="mt-2">
              <StatusPill status={message.status} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
