"use client"

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Steps } from "@/components/steps"
import type { Message } from "@/lib/api"
import { useMessageStore } from "@/lib/stores/message-store"
import { useToast } from "@/hooks/use-toast"

interface SolutionWorkflowDrawerProps {
  message: Message | null
  onClose: () => void
}

export function SolutionWorkflowDrawer({ message, onClose }: SolutionWorkflowDrawerProps) {
  const { setSelectedMessage } = useMessageStore()
  const { toast } = useToast()

  const steps = [
    { id: 1, label: "Verify case details", status: "completed" as const },
    { id: 2, label: "Send A07 message to EHR", status: "current" as const },
    { id: 3, label: "Confirm EHR acknowledgment", status: "upcoming" as const },
    { id: 4, label: "Re-process original message", status: "upcoming" as const },
  ]

  const handleMarkResolved = () => {
    toast({
      title: "Message Resolved",
      description: `Message ID ${message?.id} marked as resolved.`,
    })
    setSelectedMessage(null) // Clear selected message
    onClose()
  }

  return (
    <Drawer
      open={!!message}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedMessage(null)
          onClose()
        }
      }}
    >
      <DrawerContent className="fixed bottom-0 right-0 mt-0 h-full w-[380px] rounded-none">
        <DrawerHeader>
          <DrawerTitle>Solution Workflow for {message?.id}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto flex-1">
          {message ? (
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Event:</span> {message.event}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Patient:</span> {message.patient}
              </p>
              {message.errorMessage && (
                <p className="text-sm text-muted-foreground text-red-600">
                  <span className="font-medium">Error:</span> {message.errorMessage}
                </p>
              )}
              <Steps steps={steps} />
            </div>
          ) : (
            <p className="text-muted-foreground">No message selected.</p>
          )}
        </div>
        <DrawerFooter>
          <Button onClick={handleMarkResolved} disabled={!message}>
            Mark Resolved
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedMessage(null)
              onClose()
            }}
          >
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
