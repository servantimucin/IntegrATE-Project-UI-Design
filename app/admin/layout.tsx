"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Yönetici Paneli</h1>
      <Tabs value={pathname}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="/admin/events" asChild>
            <Link href="/admin/events">Olay Tanımları</Link>
          </TabsTrigger>
          <TabsTrigger value="/admin/errors" asChild>
            <Link href="/admin/errors">Hata Tanımları</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </div>
  )
}
