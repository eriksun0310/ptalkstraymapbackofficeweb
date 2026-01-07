"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { mockAdmin } from "@/data/mock"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FormState {
  email: string
  password: string
  error: string
  isLoading: boolean
}

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const [form, setForm] = useState<FormState>({
    email: "admin@ptalk.com",
    password: "123456",
    error: "",
    isLoading: false,
  })

  const updateForm = (updates: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...updates }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateForm({ error: "", isLoading: true })

    // 模擬 API 延遲
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 驗證假資料
    if (form.email === mockAdmin.email && form.password === mockAdmin.password) {
      login({
        id: mockAdmin.id,
        email: mockAdmin.email,
        name: mockAdmin.name,
      })
      router.push("/shelters")
    } else {
      updateForm({ error: "帳號或密碼錯誤", isLoading: false })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            PTalk 浪地圖
          </CardTitle>
          <CardDescription>後台管理系統</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@ptalk.com"
                value={form.email}
                onChange={(e) => updateForm({ email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密碼</Label>
              <Input
                id="password"
                type="password"
                placeholder="請輸入密碼"
                value={form.password}
                onChange={(e) => updateForm({ password: e.target.value })}
                required
              />
            </div>
            {form.error && (
              <p className="text-sm text-destructive">{form.error}</p>
            )}
            <Button type="submit" className="w-full" disabled={form.isLoading}>
              {form.isLoading ? "登入中..." : "登入"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>測試帳號：admin@ptalk.com</p>
            <p>測試密碼：123456</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
