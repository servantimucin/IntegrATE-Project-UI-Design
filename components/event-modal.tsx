"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { EventDefinition } from "@/lib/api"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<EventDefinition, "id"> & { id?: string }) => void
  event?: EventDefinition | null
  title: string
}

export function EventModal({ isOpen, onClose, onSave, event, title }: EventModalProps) {
  const [name, setName] = useState(event?.name || "")
  const [code, setCode] = useState(event?.code || "")
  const [description, setDescription] = useState(event?.description || "")
  const { toast } = useToast()

  useEffect(() => {
    if (event) {
      setName(event.name)
      setCode(event.code)
      setDescription(event.description)
    } else {
      setName("")
      setCode("")
      setDescription("")
    }
  }, [event, isOpen])

  const handleSubmit = () => {
    if (!name.trim() || !code.trim() || !description.trim()) {
      toast({
        title: "Doğrulama Hatası",
        description: "Ad, Kod ve Açıklama boş bırakılamaz.",
        variant: "destructive",
      })
      return
    }
    onSave({ id: event?.id, name, code, description })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Ad
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              aria-label="Olay adı"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Kod
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="col-span-3"
              aria-label="Olay kodu"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Açıklama
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              aria-label="Olay açıklaması"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button onClick={handleSubmit}>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
