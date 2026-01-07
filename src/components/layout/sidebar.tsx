"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "園區管理",
    href: "/shelters",
    icon: Home,
  },
  {
    title: "用戶管理",
    href: "/users",
    icon: Users,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/shelters" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">PTalk 浪地圖</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
