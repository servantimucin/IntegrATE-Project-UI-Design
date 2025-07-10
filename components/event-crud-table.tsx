"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { EventDefinition } from "@/lib/api"
import { EventModal } from "@/components/event-modal"

interface EventCrudTableProps {
  data: EventDefinition[]
  onAddItem: (item: Omit<EventDefinition, "id">) => Promise<void>
  onUpdateItem: (id: string, updates: Partial<EventDefinition>) => Promise<void>
  onDeleteItem: (id: string) => Promise<void>
}

export function EventCrudTable({ data, onAddItem, onUpdateItem, onDeleteItem }: EventCrudTableProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<EventDefinition | null>(null)
  const { toast } = useToast()

  const columns: ColumnDef<EventDefinition>[] = [
    {
      accessorKey: "name",
      header: "Ad",
    },
    {
      accessorKey: "code",
      header: "Kod",
    },
    {
      accessorKey: "description",
      header: "Açıklama",
    },
    {
      id: "actions",
      header: "Eylemler",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingItem(row.original)
              setIsModalOpen(true)
            }}
            aria-label={`${row.original.name} düzenle`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              if (window.confirm(`"${row.original.name}" olayını silmek istediğinizden emin misiniz?`)) {
                try {
                  await onDeleteItem(row.original.id)
                  toast({
                    title: "Başarılı",
                    description: `${row.original.name} başarıyla silindi.`,
                  })
                } catch (error) {
                  toast({
                    title: "Hata",
                    description: `${row.original.name} silinirken bir hata oluştu.`,
                    variant: "destructive",
                  })
                }
              }
            }}
            aria-label={`${row.original.name} sil`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const handleSave = async (itemData: Omit<EventDefinition, "id"> & { id?: string }) => {
    try {
      if (itemData.id) {
        await onUpdateItem(itemData.id, itemData)
        toast({
          title: "Başarılı",
          description: `${itemData.name} başarıyla güncellendi.`,
        })
      } else {
        await onAddItem(itemData)
        toast({
          title: "Başarılı",
          description: `${itemData.name} başarıyla eklendi.`,
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: `${itemData.name} kaydedilirken bir hata oluştu.`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingItem(null)
            setIsModalOpen(true)
          }}
          aria-label="Yeni olay tanımı ekle"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Yeni Olay Tanımı
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        event={editingItem}
        title={editingItem ? "Olay Tanımını Düzenle" : "Yeni Olay Tanımı Ekle"}
      />
    </div>
  )
}
