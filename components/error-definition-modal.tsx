"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { ErrorDefinition, EventDefinition, SolutionStep } from "@/lib/api"
import { fetchEventDefinitions } from "@/lib/api"
import { MultiSelect } from "@/components/ui/multi-select"
import { PlusCircle, Trash2, GripVertical } from "lucide-react" // GripVertical ikonu eklendi

interface ErrorDefinitionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (errorDef: Omit<ErrorDefinition, "id"> & { id?: string }) => void
  errorDef?: ErrorDefinition | null
  title: string
}

export function ErrorDefinitionModal({ isOpen, onClose, onSave, errorDef, title }: ErrorDefinitionModalProps) {
  const [name, setName] = useState(errorDef?.name || "")
  const [associatedEventCodes, setAssociatedEventCodes] = useState<string[]>(errorDef?.associatedEventCodes || [])
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>(errorDef?.solutionSteps || [])
  const [allEvents, setAllEvents] = useState<EventDefinition[]>([])
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null) // Sürüklenen öğenin indeksi
  const { toast } = useToast()

  useEffect(() => {
    const loadEvents = async () => {
      const events = await fetchEventDefinitions()
      setAllEvents(events)
    }
    loadEvents()
  }, [])

  useEffect(() => {
    if (errorDef) {
      setName(errorDef.name)
      setAssociatedEventCodes(errorDef.associatedEventCodes)
      // Adımları sıraya göre sırala
      setSolutionSteps(errorDef.solutionSteps.sort((a, b) => a.order - b.order))
    } else {
      setName("")
      setAssociatedEventCodes([])
      setSolutionSteps([])
    }
  }, [errorDef, isOpen])

  const handleAddStep = () => {
    setSolutionSteps((prev) => [...prev, { id: `temp-${Date.now()}`, description: "", order: prev.length + 1 }])
  }

  const handleStepChange = (id: string, newDescription: string) => {
    setSolutionSteps((prev) => prev.map((step) => (step.id === id ? { ...step, description: newDescription } : step)))
  }

  const handleRemoveStep = (id: string) => {
    setSolutionSteps((prev) =>
      prev.filter((step) => step.id !== id).map((step, index) => ({ ...step, order: index + 1 })),
    )
  }

  // Sürükleme başlangıcı
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItemIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  // Sürükleme sırasında
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault() // Bırakmaya izin ver
    e.dataTransfer.dropEffect = "move"
  }

  // Bırakma işlemi
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) {
      setDraggedItemIndex(null)
      return
    }

    const newSteps = [...solutionSteps]
    const [draggedItem] = newSteps.splice(draggedItemIndex, 1) // Sürüklenen öğeyi çıkar
    newSteps.splice(dropIndex, 0, draggedItem) // Yeni konuma ekle

    // Yeni sıraya göre 'order' değerlerini güncelle
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      order: index + 1,
    }))

    setSolutionSteps(reorderedSteps)
    setDraggedItemIndex(null) // Sürüklenen öğe indeksini sıfırla
  }

  const handleSubmit = () => {
    if (!name.trim() || associatedEventCodes.length === 0) {
      toast({
        title: "Doğrulama Hatası",
        description: "Ad ve İlişkili Olay Kodları boş bırakılamaz.",
        variant: "destructive",
      })
      return
    }
    if (solutionSteps.some((step) => !step.description.trim())) {
      toast({
        title: "Doğrulama Hatası",
        description: "Çözüm adımları boş bırakılamaz.",
        variant: "destructive",
      })
      return
    }

    onSave({
      id: errorDef?.id,
      name,
      associatedEventCodes,
      solutionSteps: solutionSteps.map((step, index) => ({ ...step, order: index + 1 })), // Kaydetmeden önce son kez sıralamayı doğrula
    })
    onClose()
  }

  const eventOptions = allEvents.map((event) => ({
    label: `${event.name} (${event.code})`,
    value: event.code,
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
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
              aria-label="Hata tanımı adı"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="associatedEventCodes" className="text-right">
              İlişkili Olaylar
            </Label>
            <div className="col-span-3">
              <MultiSelect
                options={eventOptions}
                selected={associatedEventCodes}
                onSelect={setAssociatedEventCodes}
                placeholder="Olayları seçin..."
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Çözüm Adımları</Label>
            <div className="col-span-3 flex flex-col gap-2">
              {solutionSteps.map((step, index) => (
                <div
                  key={step.id}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="flex items-center gap-2 p-1 rounded-md border border-transparent hover:border-gray-200 transition-all"
                  style={{ opacity: draggedItemIndex === index ? 0.5 : 1 }} // Sürüklenirken görsel geri bildirim
                >
                  <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" aria-hidden="true" />
                  <Input
                    value={step.description}
                    onChange={(e) => handleStepChange(step.id, e.target.value)}
                    placeholder={`Adım ${index + 1} açıklaması`}
                    aria-label={`Çözüm adımı ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveStep(step.id)}
                    aria-label="Çözüm adımını sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddStep} className="w-full bg-transparent">
                <PlusCircle className="mr-2 h-4 w-4" /> Adım Ekle
              </Button>
            </div>
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
