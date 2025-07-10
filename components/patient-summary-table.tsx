"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import type { PatientSummary } from "@/lib/api"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

interface PatientSummaryTableProps {
  data: PatientSummary[]
}

export function PatientSummaryTable({ data }: PatientSummaryTableProps) {
  const columns: ColumnDef<PatientSummary>[] = [
    {
      accessorKey: "name",
      header: "Hasta Adı",
      cell: ({ row }) => (
        <Link
          href={`/patients/${encodeURIComponent(row.original.name)}/messages`}
          className="text-blue-600 hover:underline font-medium"
          aria-label={`${row.original.name} için tüm mesajları görüntüle`}
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "visitStatus",
      header: "Ziyaret Durumu",
      cell: ({ row }) => {
        const status = row.original.visitStatus
        let colorClass = ""
        switch (status) {
          case "Admitted":
          case "Inpatient":
            colorClass = "bg-blue-100 text-blue-800"
            break
          case "Discharged":
            colorClass = "bg-gray-100 text-gray-800"
            break
          case "Pending":
            colorClass = "bg-yellow-100 text-yellow-800"
            break
          case "Outpatient":
          default:
            colorClass = "bg-purple-100 text-purple-800"
            break
        }
        return <Badge className={colorClass}>{status}</Badge>
      },
    },
    {
      accessorKey: "hasError",
      header: "Hata Durumu",
      cell: ({ row }) => {
        const hasError = row.original.hasError
        return (
          <Badge className={hasError ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
            {hasError ? (
              <>
                <XCircle className="mr-1 h-3 w-3" /> Hata
              </>
            ) : (
              <>
                <CheckCircle className="mr-1 h-3 w-3" /> Hata Yok
              </>
            )}
          </Badge>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      // onRowClick burada gerekli değil çünkü hasta adı zaten bir bağlantı
    />
  )
}
