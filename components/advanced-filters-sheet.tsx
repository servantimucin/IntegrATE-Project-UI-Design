"use client"

import React from "react"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import type { MessageStatus } from "@/lib/api"

interface AdvancedFiltersSheetProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: {
    status?: MessageStatus
    dateRange?: [string, string]
    events?: string[]
  }) => void
  currentFilters: {
    status?: MessageStatus
    dateRange?: [string, string]
    events?: string[]
  }
}

const allEvents = ["Patient Admit", "Order Placed", "Lab Result", "Patient Discharge", "Medication Dispense"]

export function AdvancedFiltersSheet({ isOpen, onClose, onApplyFilters, currentFilters }: AdvancedFiltersSheetProps) {
  const [statusFilter, setStatusFilter] = useState<MessageStatus | undefined>(currentFilters.status)
  const [dateRange, setDateRange] = useState<Date[] | undefined>(
    currentFilters.dateRange
      ? [new Date(currentFilters.dateRange[0]), new Date(currentFilters.dateRange[1])]
      : undefined,
  )
  const [selectedEvents, setSelectedEvents] = useState<string[]>(currentFilters.events || [])

  React.useEffect(() => {
    setStatusFilter(currentFilters.status)
    setDateRange(
      currentFilters.dateRange
        ? [new Date(currentFilters.dateRange[0]), new Date(currentFilters.dateRange[1])]
        : undefined,
    )
    setSelectedEvents(currentFilters.events || [])
  }, [currentFilters])

  const handleApply = () => {
    const filtersToApply: {
      status?: MessageStatus
      dateRange?: [string, string]
      events?: string[]
    } = {}

    if (statusFilter) {
      filtersToApply.status = statusFilter
    }
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtersToApply.dateRange = [format(dateRange[0], "yyyy-MM-dd"), format(dateRange[1], "yyyy-MM-dd")]
    }
    if (selectedEvents.length > 0) {
      filtersToApply.events = selectedEvents
    }

    onApplyFilters(filtersToApply)
    onClose()
  }

  const handleClear = () => {
    setStatusFilter(undefined)
    setDateRange(undefined)
    setSelectedEvents([])
    onApplyFilters({}) // Apply empty filters
    onClose()
  }

  const handleEventChange = (event: string, checked: boolean) => {
    setSelectedEvents((prev) => (checked ? [...prev, event] : prev.filter((e) => e !== event)))
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" /> Advanced Filters
          </SheetTitle>
          <SheetDescription>Filter messages by status, date range, or event type.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={statusFilter} onValueChange={(value: MessageStatus) => setStatusFilter(value)}>
              <SelectTrigger id="status-filter" aria-label="Select message status">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date-range-filter">Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range-filter"
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                  aria-label="Select date range"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.[0] ? (
                    dateRange[1] ? (
                      <>
                        {format(dateRange[0], "LLL dd, y")} - {format(dateRange[1], "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange[0], "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.[0]}
                  selected={dateRange ? { from: dateRange[0], to: dateRange[1] } : undefined}
                  onSelect={(range) => {
                    if (range?.from) {
                      setDateRange([range.from, range.to || range.from])
                    } else {
                      setDateRange(undefined)
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>Event Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {allEvents.map((event) => (
                <div key={event} className="flex items-center space-x-2">
                  <Checkbox
                    id={`event-${event}`}
                    checked={selectedEvents.includes(event)}
                    onCheckedChange={(checked) => handleEventChange(event, !!checked)}
                    aria-label={`Select event type ${event}`}
                  />
                  <label
                    htmlFor={`event-${event}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {event}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={handleClear}>
            Clear Filters
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
