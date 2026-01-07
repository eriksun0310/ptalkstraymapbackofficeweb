"use client"

import { GENDER_LABELS, CONTACT_METHOD_LABELS, type User, type Gender, type ContactMethod } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface UserDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export function UserDetailDialog({ open, onOpenChange, user }: UserDetailDialogProps) {
  if (!user) return null

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex py-2">
      <span className="w-28 text-muted-foreground text-sm">{label}</span>
      <span className="flex-1 text-sm">{value}</span>
    </div>
  )

  const hasEmergencyContact = user.emergencyContact || user.emergencyPhone

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>用戶詳情</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 帳號資訊 */}
          <section>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">帳號資訊</h3>
            <div className="border-t">
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="註冊時間" value={formatDateTime(user.createdAt)} />
            </div>
          </section>

          {/* 個人資料 */}
          <section>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">個人資料</h3>
            <div className="border-t">
              <InfoRow label="姓名" value={user.name} />
              <InfoRow label="生日" value={formatDate(user.birthday)} />
              <InfoRow
                label="性別"
                value={user.gender ? GENDER_LABELS[user.gender as Gender] : "-"}
              />
            </div>
          </section>

          {/* 聯絡資訊 */}
          <section>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">聯絡資訊</h3>
            <div className="border-t">
              <InfoRow
                label="偏好聯絡方式"
                value={
                  user.contactMethod
                    ? CONTACT_METHOD_LABELS[user.contactMethod as ContactMethod]
                    : "-"
                }
              />
              <InfoRow label="電話" value={user.phone || "-"} />
              <InfoRow label="LINE ID" value={user.lineId || "-"} />
            </div>
          </section>

          {/* 緊急聯絡人 */}
          {hasEmergencyContact && (
            <section>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">緊急聯絡人</h3>
              <div className="border-t">
                <InfoRow label="姓名" value={user.emergencyContact || "-"} />
                <InfoRow label="電話" value={user.emergencyPhone || "-"} />
              </div>
            </section>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            關閉
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
