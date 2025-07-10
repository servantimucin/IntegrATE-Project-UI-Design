"use client"

import * as React from "react"
import { X, Check, ChevronDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem, CommandInput, CommandEmpty, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type MultiSelectOption = {
  label: string
  value: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onSelect: (values: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({ options, selected, onSelect, placeholder, className }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
    onSelect(newSelected)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto min-h-[36px] flex-wrap", className)}
          aria-label={placeholder || "Seçim yapın"}
        >
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((value) => {
                const option = options.find((o) => o.value === value)
                return (
                  <Badge key={value} variant="secondary" className="flex items-center gap-1">
                    {option?.label}
                    <button
                      type="button"
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelect(value)
                      }}
                      aria-label={`Remove ${option?.label}`}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                )
              })}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder || "Seçim yapın..."}</span>
          )}
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Ara..." />
          <CommandList>
            <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option.value} onSelect={() => handleSelect(option.value)} className="cursor-pointer">
                  <Check
                    className={cn("mr-2 h-4 w-4", selected.includes(option.value) ? "opacity-100" : "opacity-0")}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
