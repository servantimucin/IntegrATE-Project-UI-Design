"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

export default function CatalogLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Catalog</h1>
      <Tabs value={pathname.includes("/errors") ? "/catalog/errors" : "/catalog/events"}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="/catalog/errors" asChild>
            <Link href="/catalog/errors">Error Catalog</Link>
          </TabsTrigger>
          <TabsTrigger value="/catalog/events" asChild>
            <Link href="/catalog/events">Event Catalog</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </div>
  )
}
