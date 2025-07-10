"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PatientMessageFlow } from "@/components/patient-message-flow"
import { fetchMessagesByPatient, type Message, type MessageStatus } from "@/lib/api"
import { AdvancedFiltersSheet } from "@/components/advanced-filters-sheet" // Import the filter sheet

interface PatientMessagesPageProps {
  params: {
    patientName: string
  }
}

export default function PatientMessagesPage({ params }: PatientMessagesPageProps) {
  const router = useRouter()
  const patientName = decodeURIComponent(params.patientName)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<{
    status?: MessageStatus
    dateRange?: [string, string]
    events?: string[]
  }>({})

  const loadPatientMessages = async (
    filters: {
      status?: MessageStatus
      dateRange?: [string, string]
      events?: string[]
    } = {},
  ) => {
    setLoading(true)
    try {
      const fetchedMessages = await fetchMessagesByPatient(patientName, filters)
      setMessages(fetchedMessages)
    } catch (error) {
      console.error(`Failed to fetch messages for ${patientName}:`, error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatientMessages(currentFilters)
  }, [patientName, currentFilters]) // Reload when patientName or filters change

  const handleApplyFilters = (filters: {
    status?: MessageStatus
    dateRange?: [string, string]
    events?: string[]
  }) => {
    setCurrentFilters(filters)
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Geri dön">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{patientName} için Mesajlar</h1>
        </div>
        <Button onClick={() => setIsFilterSheetOpen(true)} aria-label="Gelişmiş filtreleri aç">
          <Filter className="mr-2 h-4 w-4" /> Gelişmiş Filtreler
        </Button>
      </div>

      <Card className="p-4">
        {loading ? (
          <Skeleton className="h-[500px] w-full" />
        ) : messages.length > 0 ? (
          <PatientMessageFlow messages={messages} />
        ) : (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            {patientName} için mevcut filtrelerle mesaj bulunamadı.
          </div>
        )}
      </Card>

      <AdvancedFiltersSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />
    </div>
  )
}
