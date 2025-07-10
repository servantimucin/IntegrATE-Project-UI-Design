"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface CrudModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: { id?: string; name: string; description: string }) => void
  item?: { id: string; name: string; description: string } | null
  title: string
}

export function CrudModal({ isOpen, onClose, onSave, item, title }: CrudModalProps) {
  const [name, setName] = useState(item?.name || "")
  const [description, setDescription] = useState(item?.description || "")
  const { toast } = useToast()

  useEffect(() => {
    if (item) {
      setName(item.name)
      setDescription(item.description)
    } else {
      setName("")
      setDescription("")
    }
  }, [item, isOpen])

  const handleSubmit = () => {
    if (!name || !description) {
      toast({
        title: "Validation Error",
        description: "Name and Description cannot be empty.",
        variant: "destructive",
      })
      return
    }
    onSave({ id: item?.id, name, description })
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
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              aria-label="Item name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              aria-label="Item description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
