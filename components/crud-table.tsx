"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, PlusCircle } from "lucide-react"
import { CrudModal } from "@/components/crud-modal"
import { useToast } from "@/hooks/use-toast"

interface CrudTableProps<T extends { id: string; name: string; description: string }> {
  data: T[]
  title: string
  onAddItem: (item: Omit<T, "id">) => Promise<void>
  onUpdateItem: (id: string, updates: Partial<T>) => Promise<void>
  onDeleteItem: (id: string) => Promise<void>
}

export function CrudTable<T extends { id: string; name: string; description: string }>({
  data,
  title,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: CrudTableProps<T>) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<T | null>(null)
  const { toast } = useToast()

  const columns: ColumnDef<T>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingItem(row.original)
              setIsModalOpen(true)
            }}
            aria-label={`Edit ${row.original.name}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              if (window.confirm(`Are you sure you want to delete "${row.original.name}"?`)) {
                try {
                  await onDeleteItem(row.original.id)
                  toast({
                    title: "Success",
                    description: `${row.original.name} deleted successfully.`,
                  })
                } catch (error) {
                  toast({
                    title: "Error",
                    description: `Failed to delete ${row.original.name}.`,
                    variant: "destructive",
                  })
                }
              }
            }}
            aria-label={`Delete ${row.original.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const handleSave = async (itemData: { id?: string; name: string; description: string }) => {
    try {
      if (itemData.id) {
        await onUpdateItem(itemData.id, itemData as Partial<T>)
        toast({
          title: "Success",
          description: `${itemData.name} updated successfully.`,
        })
      } else {
        await onAddItem(itemData as Omit<T, "id">)
        toast({
          title: "Success",
          description: `${itemData.name} added successfully.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save ${itemData.name}.`,
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
          aria-label={`Add new ${title.slice(0, -1)}`}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New {title.slice(0, -1)}
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
        title={editingItem ? `Edit ${title.slice(0, -1)}` : `Add New ${title.slice(0, -1)}`}
      />
    </div>
  )
}
