"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  fetchEventDefinitions,
  addEventDefinition,
  updateEventDefinition,
  deleteEventDefinition,
  type EventDefinition,
} from "@/lib/api"
import { EventCrudTable } from "@/components/event-crud-table"

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventDefinition[]>([])
  const [loading, setLoading] = useState(true)

  const loadEvents = async () => {
    setLoading(true)
    try {
      const fetchedEvents = await fetchEventDefinitions()
      setEvents(fetchedEvents)
    } catch (error) {
      console.error("Olay tanımları getirilemedi:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleAddEvent = async (item: Omit<EventDefinition, "id">) => {
    await addEventDefinition(item)
    await loadEvents() // Ekleme sonrası veriyi yeniden yükle
  }

  const handleUpdateEvent = async (id: string, updates: Partial<EventDefinition>) => {
    await updateEventDefinition(id, updates)
    await loadEvents() // Güncelleme sonrası veriyi yeniden yükle
  }

  const handleDeleteEvent = async (id: string) => {
    await deleteEventDefinition(id)
    await loadEvents() // Silme sonrası veriyi yeniden yükle
  }

  return (
    <Card className="p-4 mt-4">
      {loading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <EventCrudTable
          data={events}
          onAddItem={handleAddEvent}
          onUpdateItem={handleUpdateEvent}
          onDeleteItem={handleDeleteEvent}
        />
      )}
    </Card>
  )
}
