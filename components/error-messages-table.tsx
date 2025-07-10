"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Message, MessageStatus } from "@/lib/api"
import { CheckCircle, XCircle, Clock, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

interface ErrorMessagesTableProps {
  columns: ColumnDef<Message, any>[] // Message tipini kullan
  data: Message[]
  onRowClick?: (message: Message) => void // onRowClick'i genel bir callback yap
}

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

export function ErrorMessagesTable({ columns, data, onRowClick }: ErrorMessagesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Sütun tanımlarını burada tutalım, böylece dışarıdan da kullanılabilir.
  const defaultColumns: ColumnDef<Message>[] = [
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

  // Eğer dışarıdan columns prop'u gelmezse defaultColumns'ı kullan
  const finalColumns = columns || defaultColumns

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Olayları filtrele..."
          value={(table.getColumn("event")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("event")?.setFilterValue(event.target.value)}
          className="max-w-sm"
          aria-label="Olayları metne göre filtrele"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto bg-transparent" aria-label="Sütun görünürlüğünü değiştir">
              Sütunlar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)} // onRowClick'i doğrudan çağır
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={finalColumns.length} className="h-24 text-center">
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length} satır seçildi.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Önceki sayfaya git"
          >
            Önceki
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Sonraki sayfaya git"
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  )
}
