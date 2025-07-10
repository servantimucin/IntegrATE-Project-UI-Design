"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MessageSquare, BookOpen, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare,
    },
    {
      title: "Catalog",
      href: "/catalog/errors", // Default to errors sub-route
      icon: BookOpen,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar side="left" collapsible="icon" variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
