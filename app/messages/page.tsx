"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { ErrorMessagesTable } from "@/components/error-messages-table"
import { AdvancedFiltersSheet } from "@/components/advanced-filters-sheet"
import { fetchMessages, type Message, type MessageStatus } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SolutionWorkflowDrawer } from "@/components/solution-workflow-drawer" // Import SolutionWorkflowDrawer
import { MessageDetailsDrawer } from "@/components/message-details-drawer" // Import MessageDetailsDrawer
import { useMessageStore } from "@/lib/stores/message-store" // Import useMessageStore
import type { ColumnDef } from "@tanstack/react-table"
import { CheckCircle, XCircle, Clock, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

const StatusIcon = ({ status }: { status: MessageStatus }) => {
  switch (status) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" aria-label="Başarılı" />
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" aria-label="Hata" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" aria-label="Beklemede" />
    default:
      return <Info className="h-4 w-4 text-gray-500" aria-label="Bilinmeyen durum" />
  }
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<{
    status?: MessageStatus
    dateRange?: [string, string]
    events?: string[]
  }>({})

  const { selectedMessage, setSelectedMessage } = useMessageStore() // Hata iş akışı çekmecesi için
  const [selectedMessageForDetails, setSelectedMessageForDetails] = useState<Message | null>(null) // Genel mesaj detay çekmecesi için

  const loadMessages = async (
    filters: {
      status?: MessageStatus
      dateRange?: [string, string]
      events?: string[]
    } = {},
  ) => {
    setLoading(true)
    try {
      const fetchedMessages = await fetchMessages(filters)
      setMessages(fetchedMessages)
    } catch (error) {
      console.error("Mesajlar getirilemedi:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages(currentFilters)
  }, [currentFilters])

  const handleApplyFilters = (filters: {
    status?: MessageStatus
    dateRange?: [string, string]
    events?: string[]
  }) => {
    setCurrentFilters(filters)
  }

  const handleMessageRowClick = (message: Message) => {
    if (message.status === "error") {
      setSelectedMessage(message) // Hata iş akışı çekmecesini aç
    } else {
      setSelectedMessageForDetails(message) // Genel mesaj detay çekmecesini aç
    }
  }

  const handleSolutionDrawerClose = () => {
    setSelectedMessage(null)
  }

  const handleDetailsDrawerClose = () => {
    setSelectedMessageForDetails(null)
  }

  const columns: ColumnDef<Message>[] = [
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ row }) => <StatusIcon status={row.original.status} />,
    },
    {
      accessorKey: "timestamp",
      header: "Zaman Damgası",
    },
    {
      accessorKey: "event",
      header: "Olay",
    },
    {
      accessorKey: "facility",
      header: "Tesis",
    },
    {
      accessorKey: "patient",
      header: "Hasta",
      cell: ({ row }) => (
        <Link
          href={`/patients/${encodeURIComponent(row.original.patient)}/messages`}
          className="text-blue-600 hover:underline"
          aria-label={`${row.original.patient} için tüm mesajları görüntüle`}
          onClick={(e) => e.stopPropagation()} // Satır tıklamasını engellemek için
        >
          {row.original.patient}
        </Link>
      ),
    },
    {
      accessorKey: "errorMessage",
      header: "Hata Mesajı",
      cell: ({ row }) => {
        const errorMessage = row.original.errorMessage
        if (!errorMessage) return "Yok"
        const truncated = errorMessage.length > 50 ? `${errorMessage.substring(0, 47)}...` : errorMessage
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">{truncated}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{errorMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "count",
      header: "Sayı",
    },
  ]

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mesajlar</h1>
        <Button onClick={() => setIsFilterSheetOpen(true)} aria-label="Gelişmiş filtreleri aç">
          <Filter className="mr-2 h-4 w-4" /> Gelişmiş Filtreler
        </Button>
      </div>

      <Card className="p-4">
        {loading ? (
          <Skeleton className="h-[500px] w-full" />
        ) : (
          <ErrorMessagesTable columns={columns} data={messages} onRowClick={handleMessageRowClick} />
        )}
      </Card>

      <AdvancedFiltersSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />

      {/* Her iki çekmeceyi de kendi state'leri tarafından kontrol edilecek şekilde render et */}
      <SolutionWorkflowDrawer message={selectedMessage} onClose={handleSolutionDrawerClose} />
      <MessageDetailsDrawer message={selectedMessageForDetails} onClose={handleDetailsDrawerClose} />
    </div>
  )
}
