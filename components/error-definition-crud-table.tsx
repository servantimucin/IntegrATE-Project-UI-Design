"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ErrorDefinition } from "@/lib/api"
import { ErrorDefinitionModal } from "@/components/error-definition-modal"

interface ErrorDefinitionCrudTableProps {
  data: ErrorDefinition[]
  onAddItem: (item: Omit<ErrorDefinition, "id">) => Promise<void>
  onUpdateItem: (id: string, updates: Partial<ErrorDefinition>) => Promise<void>
  onDeleteItem: (id: string) => Promise<void>
}

export function ErrorDefinitionCrudTable({
  data,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: ErrorDefinitionCrudTableProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<ErrorDefinition | null>(null)
  const { toast } = useToast()

  const columns: ColumnDef<ErrorDefinition>[] = [
    {
      accessorKey: "name",
      header: "Ad",
    },
    {
      accessorKey: "associatedEventCodes",
      header: "İlişkili Olay Kodları",
      cell: ({ row }) => row.original.associatedEventCodes.join(", "),
    },
    {
      accessorKey: "solutionSteps",
      header: "Çözüm Adımları Sayısı",
      cell: ({ row }) => row.original.solutionSteps.length,
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
              if (window.confirm(`"${row.original.name}" hata tanımını silmek istediğinizden emin misiniz?`)) {
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

  const handleSave = async (itemData: Omit<ErrorDefinition, "id"> & { id?: string }) => {
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
          aria-label="Yeni hata tanımı ekle"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Yeni Hata Tanımı
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
      <ErrorDefinitionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        errorDef={editingItem}
        title={editingItem ? "Hata Tanımını Düzenle" : "Yeni Hata Tanımı Ekle"}
      />
    </div>
  )
}
