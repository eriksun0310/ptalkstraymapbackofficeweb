"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { useSidebarStore } from "@/stores/sidebar-store"
import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { isCollapsed, setCollapsed } = useSidebarStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleMainClick = () => {
    // 點擊主內容區域時收合 sidebar
    if (!isCollapsed) {
      setCollapsed(true)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>載入中...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main
        className="flex-1 overflow-auto bg-background"
        onClick={handleMainClick}
      >
        {children}
      </main>
    </div>
  )
}
