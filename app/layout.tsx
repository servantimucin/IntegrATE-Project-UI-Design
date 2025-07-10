import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"

import "./globals.css"
import { cn } from "@/lib/utils"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Message Flow Dashboard",
  description: "A dashboard for monitoring message flow and errors.",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="flex flex-1 flex-col md:pl-[var(--sidebar-width-icon)] group-hover/sidebar-wrapper:md:pl-[var(--sidebar-width)] transition-[padding-left] duration-200 ease-linear">
              <div className="mx-auto w-full max-w-content-max p-6">{children}</div>
            </main>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
