"use client"

import { useEffect, useState } from "react"
import { CrudTable } from "@/components/crud-table"
import { fetchCatalogItems, addCatalogItem, updateCatalogItem, deleteCatalogItem, type CatalogItem } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EventCatalogPage() {
  const [events, setEvents] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadEvents = async () => {
    setLoading(true)
    try {
      const fetchedEvents = await fetchCatalogItems("event")
      setEvents(fetchedEvents)
    } catch (error) {
      console.error("Failed to fetch event catalog:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleAddEvent = async (item: Omit<CatalogItem, "id">) => {
    await addCatalogItem({ ...item, type: "event" })
    await loadEvents() // Reload data after add
  }

  const handleUpdateEvent = async (id: string, updates: Partial<CatalogItem>) => {
    await updateCatalogItem(id, updates)
    await loadEvents() // Reload data after update
  }

  const handleDeleteEvent = async (id: string) => {
    await deleteCatalogItem(id)
    await loadEvents() // Reload data after delete
  }

  return (
    <Card className="p-4 mt-4">
      {loading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <CrudTable
          data={events}
          title="Events"
          onAddItem={handleAddEvent}
          onUpdateItem={handleUpdateEvent}
          onDeleteItem={handleDeleteEvent}
        />
      )}
    </Card>
  )
}
