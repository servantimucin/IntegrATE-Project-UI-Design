"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  fetchErrorDefinitions,
  addErrorDefinition,
  updateErrorDefinition,
  deleteErrorDefinition,
  type ErrorDefinition,
} from "@/lib/api"
import { ErrorDefinitionCrudTable } from "@/components/error-definition-crud-table"

export default function AdminErrorsPage() {
  const [errors, setErrors] = useState<ErrorDefinition[]>([])
  const [loading, setLoading] = useState(true)

  const loadErrors = async () => {
    setLoading(true)
    try {
      const fetchedErrors = await fetchErrorDefinitions()
      setErrors(fetchedErrors)
    } catch (error) {
      console.error("Hata tanımları getirilemedi:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadErrors()
  }, [])

  const handleAddError = async (item: Omit<ErrorDefinition, "id">) => {
    await addErrorDefinition(item)
    await loadErrors() // Ekleme sonrası veriyi yeniden yükle
  }

  const handleUpdateError = async (id: string, updates: Partial<ErrorDefinition>) => {
    await updateErrorDefinition(id, updates)
    await loadErrors() // Güncelleme sonrası veriyi yeniden yükle
  }

  const handleDeleteError = async (id: string) => {
    await deleteErrorDefinition(id)
    await loadErrors() // Silme sonrası veriyi yeniden yükle
  }

  return (
    <Card className="p-4 mt-4">
      {loading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <ErrorDefinitionCrudTable
          data={errors}
          onAddItem={handleAddError}
          onUpdateItem={handleUpdateError}
          onDeleteItem={handleDeleteError}
        />
      )}
    </Card>
  )
}
