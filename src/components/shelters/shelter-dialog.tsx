"use client"

import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { CITIES, getDistrictsByCity } from "@/lib/constants"
import { SHELTER_TAG_LABELS, type ShelterDetail, type ShelterTag } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckboxWithLabel } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface ShelterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shelter?: ShelterDetail | null
  onSave: (shelter: ShelterDetail) => void
  onDelete?: (id: string) => void
}

interface FormState {
  name: string
  city: string
  district: string
  shortDescription: string
  description: string
  tags: ShelterTag[]
  requiresAppointment: boolean
  allowsDropIn: boolean
  acceptsVolunteers: boolean
  acceptsDonations: boolean
  specialNotes: string
  phone: string
  line: string
  facebook: string
  instagram: string
  rules: string[]
}

const ALL_TAGS: ShelterTag[] = ["remote", "appointment", "small", "private"]

const getInitialState = (shelter?: ShelterDetail | null): FormState => ({
  name: shelter?.name || "",
  city: shelter?.city || "",
  district: shelter?.district || "",
  shortDescription: shelter?.shortDescription || "",
  description: shelter?.description || "",
  tags: shelter?.tags || [],
  requiresAppointment: shelter?.notices.requiresAppointment || false,
  allowsDropIn: shelter?.notices.allowsDropIn || false,
  acceptsVolunteers: shelter?.notices.acceptsVolunteers || false,
  acceptsDonations: shelter?.notices.acceptsDonations || false,
  specialNotes: shelter?.notices.specialNotes || "",
  phone: shelter?.contact.phone || "",
  line: shelter?.contact.line || "",
  facebook: shelter?.contact.facebook || "",
  instagram: shelter?.contact.instagram || "",
  rules: shelter?.rules || [],
})

export function ShelterDialog({
  open,
  onOpenChange,
  shelter,
  onSave,
  onDelete,
}: ShelterDialogProps) {
  const [form, setForm] = useState<FormState>(getInitialState(shelter))
  const [newRule, setNewRule] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isEdit = !!shelter

  // 當 shelter 變更時重置表單
  useEffect(() => {
    if (open) {
      setForm(getInitialState(shelter))
      setNewRule("")
      setShowDeleteConfirm(false)
    }
  }, [open, shelter])

  const updateForm = (updates: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...updates }))
  }

  const districts = form.city ? getDistrictsByCity(form.city) : []

  const handleTagToggle = (tag: ShelterTag) => {
    updateForm({
      tags: form.tags.includes(tag)
        ? form.tags.filter((t) => t !== tag)
        : [...form.tags, tag],
    })
  }

  const handleAddRule = () => {
    if (newRule.trim()) {
      updateForm({ rules: [...form.rules, newRule.trim()] })
      setNewRule("")
    }
  }

  const handleRemoveRule = (index: number) => {
    updateForm({ rules: form.rules.filter((_, i) => i !== index) })
  }

  const handleSubmit = () => {
    const shelterData: ShelterDetail = {
      id: shelter?.id || Date.now().toString(),
      name: form.name,
      city: form.city,
      district: form.district,
      shortDescription: form.shortDescription,
      description: form.description,
      tags: form.tags,
      notices: {
        requiresAppointment: form.requiresAppointment,
        allowsDropIn: form.allowsDropIn,
        acceptsVolunteers: form.acceptsVolunteers,
        acceptsDonations: form.acceptsDonations,
        specialNotes: form.specialNotes || undefined,
      },
      contact: {
        phone: form.phone || undefined,
        line: form.line || undefined,
        facebook: form.facebook || undefined,
        instagram: form.instagram || undefined,
      },
      rules: form.rules.length > 0 ? form.rules : undefined,
    }

    onSave(shelterData)
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (shelter && onDelete) {
      onDelete(shelter.id)
      onOpenChange(false)
    }
  }

  const isFormValid = form.name && form.city && form.district && form.shortDescription

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEdit ? "編輯園區" : "新增園區"}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* 基本資訊 */}
          <section className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">基本資訊</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">園區名稱 *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">縣市 *</Label>
                <Select
                  id="city"
                  value={form.city}
                  onChange={(e) => updateForm({ city: e.target.value, district: "" })}
                >
                  <option value="">請選擇縣市</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">區域 *</Label>
                <Select
                  id="district"
                  value={form.district}
                  onChange={(e) => updateForm({ district: e.target.value })}
                  disabled={!form.city}
                >
                  <option value="">請選擇區域</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">簡短描述 *</Label>
              <Input
                id="shortDescription"
                value={form.shortDescription}
                onChange={(e) => updateForm({ shortDescription: e.target.value })}
                placeholder="用於列表顯示的簡短描述"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">完整描述</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                placeholder="園區的完整介紹"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>標籤</Label>
              <div className="flex flex-wrap gap-4">
                {ALL_TAGS.map((tag) => (
                  <CheckboxWithLabel
                    key={tag}
                    label={SHELTER_TAG_LABELS[tag]}
                    checked={form.tags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 注意事項 */}
          <section className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">注意事項</h3>
            <div className="flex flex-wrap gap-4">
              <CheckboxWithLabel
                label="需要預約"
                checked={form.requiresAppointment}
                onChange={(e) => updateForm({ requiresAppointment: e.target.checked })}
              />
              <CheckboxWithLabel
                label="可直接到訪"
                checked={form.allowsDropIn}
                onChange={(e) => updateForm({ allowsDropIn: e.target.checked })}
              />
              <CheckboxWithLabel
                label="接受志工"
                checked={form.acceptsVolunteers}
                onChange={(e) => updateForm({ acceptsVolunteers: e.target.checked })}
              />
              <CheckboxWithLabel
                label="接受捐款"
                checked={form.acceptsDonations}
                onChange={(e) => updateForm({ acceptsDonations: e.target.checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialNotes">特殊說明</Label>
              <Textarea
                id="specialNotes"
                value={form.specialNotes}
                onChange={(e) => updateForm({ specialNotes: e.target.value })}
                placeholder="其他需要注意的事項"
                rows={2}
              />
            </div>
          </section>

          {/* 聯絡方式 */}
          <section className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">聯絡方式</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">電話</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => updateForm({ phone: e.target.value })}
                  placeholder="04-12345678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="line">LINE ID</Label>
                <Input
                  id="line"
                  value={form.line}
                  onChange={(e) => updateForm({ line: e.target.value })}
                  placeholder="line_id"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={form.facebook}
                  onChange={(e) => updateForm({ facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={form.instagram}
                  onChange={(e) => updateForm({ instagram: e.target.value })}
                  placeholder="instagram_account"
                />
              </div>
            </div>
          </section>

          {/* 參訪規則 */}
          <section className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">參訪規則</h3>
            <div className="flex gap-2">
              <Input
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="新增規則"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddRule()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddRule}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {form.rules.length > 0 && (
              <ul className="space-y-2">
                {form.rules.map((rule, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                  >
                    <span className="text-sm">{rule}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRule(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          {isEdit && onDelete && (
            <div className="flex-1">
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-destructive">確定刪除？</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    確定
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    取消
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  刪除
                </Button>
              )}
            </div>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {isEdit ? "儲存" : "新增"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
