"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface FacilityTabsProps {
  facilities: string[]
  onSelectFacility: (facility: string) => void
}

export function FacilityTabs({ facilities, onSelectFacility }: FacilityTabsProps) {
  const [activeTab, setActiveTab] = useState(facilities[0])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    onSelectFacility(value)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:w-auto">
        {facilities.map((facility) => (
          <TabsTrigger key={facility} value={facility} aria-controls={`tab-content-${facility}`}>
            {facility}
          </TabsTrigger>
        ))}
      </TabsList>
      {/* Content for tabs can be rendered here or in the parent component */}
      {facilities.map((facility) => (
        <TabsContent key={facility} value={facility} id={`tab-content-${facility}`} className="sr-only">
          {/* Content is handled by parent component */}
        </TabsContent>
      ))}
    </Tabs>
  )
}
