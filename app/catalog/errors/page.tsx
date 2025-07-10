"use client"

import { useEffect, useState } from "react"
import { CrudTable } from "@/components/crud-table"
import { fetchCatalogItems, addCatalogItem, updateCatalogItem, deleteCatalogItem, type CatalogItem } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ErrorCatalogPage() {
  const [errors, setErrors] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadErrors = async () => {
    setLoading(true)
    try {
      const fetchedErrors = await fetchCatalogItems("error")
      setErrors(fetchedErrors)
    } catch (error) {
      console.error("Failed to fetch error catalog:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadErrors()
  }, [])

  const handleAddError = async (item: Omit<CatalogItem, "id">) => {
    await addCatalogItem({ ...item, type: "error" })
    await loadErrors() // Reload data after add
  }

  const handleUpdateError = async (id: string, updates: Partial<CatalogItem>) => {
    await updateCatalogItem(id, updates)
    await loadErrors() // Reload data after update
  }

  const handleDeleteError = async (id: string) => {
    await deleteCatalogItem(id)
    await loadErrors() // Reload data after delete
  }

  return (
    <Card className="p-4 mt-4">
      {loading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <CrudTable
          data={errors}
          title="Errors"
          onAddItem={handleAddError}
          onUpdateItem={handleUpdateError}
          onDeleteItem={handleDeleteError}
        />
      )}
    </Card>
  )
}
