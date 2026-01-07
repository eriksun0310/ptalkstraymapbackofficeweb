"use client"

import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const router = useRouter()
  const { admin, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{admin?.name || "管理員"}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          登出
        </Button>
      </div>
    </header>
  )
}
