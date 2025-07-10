"use client"

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import type { Message } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MessageDetailsDrawerProps {
  message: Message | null
  onClose: () => void
}

export function MessageDetailsDrawer({ message, onClose }: MessageDetailsDrawerProps) {
  if (!message) return null

  let statusColorClass = ""
  switch (message.status) {
    case "success":
      statusColorClass = "bg-green-100 text-green-800"
      break
    case "error":
      statusColorClass = "bg-red-100 text-red-800"
      break
    case "pending":
      statusColorClass = "bg-yellow-100 text-yellow-800"
      break
    default:
      statusColorClass = "bg-gray-100 text-gray-800"
  }

  return (
    <Drawer open={!!message} onOpenChange={onClose}>
      <DrawerContent className="fixed bottom-0 right-0 mt-0 h-full w-[380px] rounded-none">
        <DrawerHeader>
          <DrawerTitle>Mesaj Detayları: {message.id}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto flex-1 grid gap-4 text-sm">
          <p>
            <span className="font-medium">Zaman Damgası:</span> {message.timestamp}
          </p>
          <p>
            <span className="font-medium">Olay:</span> {message.event}
          </p>
          <p>
            <span className="font-medium">Tesis:</span> {message.facility}
          </p>
          <p>
            <span className="font-medium">Hasta:</span> {message.patient}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium">Durum:</span>{" "}
            <Badge className={cn("capitalize", statusColorClass)}>{message.status}</Badge>
          </p>
          {message.errorMessage && (
            <p className="text-red-600">
              <span className="font-medium">Hata Mesajı:</span> {message.errorMessage}
            </p>
          )}
          {message.mrn && (
            <p>
              <span className="font-medium">MRN:</span> {message.mrn}
            </p>
          )}
          {message.caseNumber && (
            <p>
              <span className="font-medium">Vaka Numarası:</span> {message.caseNumber}
            </p>
          )}
        </div>
        <DrawerFooter>
          <Button onClick={onClose}>Kapat</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
