// 園區標籤
export type ShelterTag = 'remote' | 'appointment' | 'small' | 'private'

// 標籤顯示對照
export const SHELTER_TAG_LABELS: Record<ShelterTag, string> = {
  remote: '偏遠',
  appointment: '需預約',
  small: '小型園',
  private: '私人狗園',
}

// 園區聯絡方式
export interface ContactInfo {
  line?: string
  phone?: string
  facebook?: string
  instagram?: string
}

// 園區注意事項
export interface ShelterNotices {
  requiresAppointment: boolean
  allowsDropIn: boolean
  acceptsVolunteers: boolean
  acceptsDonations: boolean
  specialNotes?: string
}

// 園區列表項目
export interface ShelterListItem {
  id: string
  name: string
  city: string
  district: string
  shortDescription: string
  tags: ShelterTag[]
}

// 園區詳情
export interface ShelterDetail extends ShelterListItem {
  description: string
  notices: ShelterNotices
  contact: ContactInfo
  rules?: string[]
}

// 性別
export type Gender = 'male' | 'female' | 'other'

// 性別顯示對照
export const GENDER_LABELS: Record<Gender, string> = {
  male: '男',
  female: '女',
  other: '其他',
}

// 聯絡方式
export type ContactMethod = 'phone' | 'line'

// 聯絡方式顯示對照
export const CONTACT_METHOD_LABELS: Record<ContactMethod, string> = {
  phone: '電話',
  line: 'LINE',
}

// 用戶
export interface User {
  id: string
  email: string
  name: string
  birthday: string | null
  gender: Gender | ''
  contactMethod: ContactMethod | ''
  phone: string
  lineId: string
  emergencyContact: string
  emergencyPhone: string
  createdAt: string
}

// 管理員
export interface Admin {
  id: string
  email: string
  name: string
}

// API 回應格式
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// 分頁回應
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
