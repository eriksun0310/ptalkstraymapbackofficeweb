"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { useUserStore } from "@/stores/user-store"
import { GENDER_LABELS, type User, type Gender } from "@/types"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserDetailDialog } from "@/components/users/user-detail-dialog"

const ITEMS_PER_PAGE = 10

export default function UsersPage() {
  const { users } = useUserStore()

  // 篩選狀態
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Dialog 狀態
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // 篩選邏輯
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        search === "" ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    })
  }, [users, search])

  // 分頁邏輯
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const handleRowClick = (user: User) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="用戶管理" />
      <div className="flex-1 p-6 space-y-6">
        {/* 工具列 */}
        <div className="flex gap-4">
          {/* 搜尋 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋姓名或 Email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 w-80"
            />
          </div>
        </div>

        {/* 表格 */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>電話</TableHead>
                <TableHead>性別</TableHead>
                <TableHead>註冊日期</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    沒有找到符合條件的用戶
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer"
                    onClick={() => handleRowClick(user)}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>
                      {user.gender ? GENDER_LABELS[user.gender as Gender] : "-"}
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 分頁 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              上一頁
            </Button>
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              第 {currentPage} / {totalPages} 頁
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              下一頁
            </Button>
          </div>
        )}
      </div>

      {/* 用戶詳情 Dialog */}
      <UserDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
      />
    </div>
  )
}
