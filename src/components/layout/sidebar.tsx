"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/stores/sidebar-store"

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
  const { isCollapsed, setCollapsed } = useSidebarStore()

  const handleExpand = (e: React.MouseEvent) => {
    // 只有在收合狀態下點擊才展開
    if (isCollapsed) {
      e.preventDefault()
      e.stopPropagation()
      setCollapsed(false)
    }
  }

  return (
    <div
      onClick={handleExpand}
      className={cn(
        "flex h-full flex-col bg-card border-r transition-all duration-300",
        isCollapsed ? "w-16 cursor-pointer" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Link
          href="/shelters"
          className="flex items-center space-x-2 overflow-hidden"
          onClick={(e) => isCollapsed && e.preventDefault()}
        >
          {isCollapsed ? (
            <span className="text-xl font-bold text-primary">P</span>
          ) : (
            <span className="text-xl font-bold text-primary whitespace-nowrap">PTalk 浪地圖</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.title : undefined}
              onClick={(e) => isCollapsed && e.preventDefault()}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isCollapsed ? "justify-center" : "space-x-3",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
