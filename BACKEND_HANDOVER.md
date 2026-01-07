# PTalk 浪地圖 - 後台專案交接文件

> 此文件用於後台專案開發，確保與前端 App 資料結構和 API 對齊

---

## 一、專案概述

### 前端 App 資訊

| 項目 | 內容 |
|------|------|
| 專案名稱 | PTalk 浪地圖（收容所目錄 App） |
| 技術棧 | Expo + React Native + TypeScript |
| 狀態管理 | Zustand |
| 資料請求 | TanStack Query v5 |

### 後台專案要求

| 項目 | 內容 |
|------|------|
| 框架 | Next.js |
| 狀態管理 | Zustand |
| 資料請求 | TanStack Query |
| 認證 | 單一管理員登入（無註冊功能） |

---

## 二、資料模型定義

### 2.1 園區（Shelter）

#### 標籤類型

```typescript
type ShelterTag = 'remote' | 'appointment' | 'small' | 'private'
```

| 值 | 中文 | 說明 |
|----|------|------|
| `remote` | 偏遠 | 位置較偏遠的園區 |
| `appointment` | 需預約 | 需要事先預約才能參訪 |
| `small` | 小型園 | 小型收容園區 |
| `private` | 私人狗園 | 私人經營的園區 |

#### 聯絡方式

```typescript
interface ContactInfo {
  line?: string;        // LINE ID
  phone?: string;       // 電話號碼
  facebook?: string;    // Facebook 連結
  instagram?: string;   // Instagram 連結
}
```

#### 注意事項

```typescript
interface ShelterNotices {
  requiresAppointment: boolean;  // 是否需要預約
  allowsDropIn: boolean;         // 是否可直接到訪
  acceptsVolunteers: boolean;    // 是否接受志工
  acceptsDonations: boolean;     // 是否接受捐款
  specialNotes?: string;         // 特殊說明
}
```

#### 園區列表項目（用於列表顯示）

```typescript
interface ShelterListItem {
  id: string;
  name: string;              // 園區名稱
  city: string;              // 縣市
  district: string;          // 區域
  shortDescription: string;  // 簡短描述（列表用）
  tags: ShelterTag[];        // 標籤陣列
}
```

#### 園區詳細資訊（用於詳情頁）

```typescript
interface ShelterDetail extends ShelterListItem {
  description: string;       // 完整描述
  notices: ShelterNotices;   // 注意事項
  contact: ContactInfo;      // 聯絡方式
  rules?: string[];          // 志工/參訪規則列表
}
```

#### 篩選條件

```typescript
interface ShelterFilters {
  city?: string;           // 篩選縣市
  district?: string;       // 篩選區域
  tags?: ShelterTag[];     // 篩選標籤
}
```

---

### 2.2 使用者（User）

#### 性別與聯絡方式類型

```typescript
type Gender = 'male' | 'female' | 'other'
type ContactMethod = 'phone' | 'line'
```

#### 使用者資料

```typescript
interface User {
  id: string;
  email: string;                      // 帳號 Email
  name: string;                       // 聯絡人姓名
  birthday: string | null;            // 生日（ISO 8601 格式）
  gender: Gender | '';                // 性別
  contactMethod: ContactMethod | '';  // 偏好聯絡方式
  phone: string;                      // 電話號碼
  lineId: string;                     // LINE ID
  emergencyContact: string;           // 緊急聯絡人姓名（未滿 18 歲必填）
  emergencyPhone: string;             // 緊急聯絡人電話（未滿 18 歲必填）
}
```

#### 驗證規則

| 欄位 | 規則 |
|------|------|
| email | 必填、Email 格式、不可重複 |
| password | 必填、至少 6 字元 |
| name | 必填 |
| birthday | 必填、不可超過今天 |
| gender | 必填（male / female / other） |
| phone | 格式 `09xxxxxxxx`（10 碼，09 開頭） |
| emergencyContact | 未滿 18 歲時必填 |
| emergencyPhone | 未滿 18 歲時必填，格式同 phone |

---

### 2.3 管理員（Admin）- 後台專用

```typescript
interface Admin {
  id: string;
  email: string;
  password: string;       // bcrypt 加密儲存
  name: string;
  lastLoginAt: Date;
  createdAt: Date;
}
```

---

## 三、API 規格

### 3.1 通用回應格式

```typescript
// 成功回應
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 分頁回應
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// 錯誤回應
interface ApiError {
  success: false;
  message: string;
  code?: string;
}
```

---

### 3.2 認證 API（後台管理員）

#### 登入

```
POST /api/admin/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "1",
      "email": "admin@example.com",
      "name": "管理員"
    },
    "token": "jwt_token_here"
  }
}
```

#### 登出

```
POST /api/admin/logout
```

#### 取得當前管理員

```
GET /api/admin/me
Headers: Authorization: Bearer {token}
```

---

### 3.3 園區 API

#### 取得園區列表

```
GET /api/shelters
```

**Query Parameters:**
| 參數 | 類型 | 說明 |
|------|------|------|
| page | number | 頁碼（預設 1） |
| limit | number | 每頁數量（預設 10） |
| city | string | 篩選縣市 |
| district | string | 篩選區域 |
| tags | string | 篩選標籤（逗號分隔） |
| search | string | 搜尋關鍵字 |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "1",
        "name": "浪浪天堂",
        "city": "台中市",
        "district": "太平區",
        "shortDescription": "位於台中山區的大型收容園區",
        "tags": ["remote", "appointment"]
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "hasMore": true
  }
}
```

#### 取得單一園區詳情

```
GET /api/shelters/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "浪浪天堂",
    "city": "台中市",
    "district": "太平區",
    "shortDescription": "位於台中山區的大型收容園區",
    "description": "我們是一群愛狗人士...",
    "tags": ["remote", "appointment"],
    "notices": {
      "requiresAppointment": true,
      "allowsDropIn": false,
      "acceptsVolunteers": true,
      "acceptsDonations": true,
      "specialNotes": "請穿著方便活動的服裝"
    },
    "contact": {
      "phone": "04-12345678",
      "line": "shelter001",
      "facebook": "https://facebook.com/shelter001"
    },
    "rules": [
      "請勿攜帶外食",
      "請勿擅自餵食",
      "聽從工作人員指示"
    ]
  }
}
```

#### 新增園區（後台）

```
POST /api/shelters
Headers: Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "新園區",
  "city": "台北市",
  "district": "大安區",
  "shortDescription": "簡短描述",
  "description": "完整描述",
  "tags": ["small"],
  "notices": {
    "requiresAppointment": false,
    "allowsDropIn": true,
    "acceptsVolunteers": true,
    "acceptsDonations": true
  },
  "contact": {
    "phone": "02-12345678"
  },
  "rules": ["規則一", "規則二"]
}
```

#### 更新園區（後台）

```
PUT /api/shelters/:id
Headers: Authorization: Bearer {token}
```

#### 刪除園區（後台）

```
DELETE /api/shelters/:id
Headers: Authorization: Bearer {token}
```

---

### 3.4 使用者 API

#### 使用者登入（App 用）

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "name": "王小明",
      "birthday": "2000-01-15T00:00:00.000Z",
      "gender": "male",
      "contactMethod": "phone",
      "phone": "0912345678",
      "lineId": "",
      "emergencyContact": "",
      "emergencyPhone": ""
    },
    "token": "jwt_token_here"
  }
}
```

#### 使用者註冊（App 用）

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "王小明",
  "birthday": "2000-01-15T00:00:00.000Z",
  "gender": "male",
  "contactMethod": "phone",
  "phone": "0912345678",
  "lineId": "",
  "emergencyContact": "",
  "emergencyPhone": ""
}
```

#### 更新個人資料（App 用）

```
PATCH /api/auth/profile
Headers: Authorization: Bearer {token}
```

**Request Body:**（僅可編輯欄位）
```json
{
  "name": "王小明",
  "contactMethod": "line",
  "phone": "0912345678",
  "lineId": "xiaoming123",
  "emergencyContact": "王大明",
  "emergencyPhone": "0987654321"
}
```

#### 取得使用者列表（後台）

```
GET /api/users
Headers: Authorization: Bearer {token}
```

**Query Parameters:**
| 參數 | 類型 | 說明 |
|------|------|------|
| page | number | 頁碼 |
| limit | number | 每頁數量 |
| search | string | 搜尋（email 或姓名） |

#### 取得單一使用者（後台）

```
GET /api/users/:id
Headers: Authorization: Bearer {token}
```

#### 刪除/停用使用者（後台）

```
DELETE /api/users/:id
Headers: Authorization: Bearer {token}
```

---

## 四、地區資料

### 台灣縣市與區域對照

後台需提供相同的地區資料供篩選使用：

```typescript
const TAIWAN_REGIONS: Record<string, string[]> = {
  '台北市': [
    '中正區', '大同區', '中山區', '松山區', '大安區', '萬華區',
    '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'
  ],
  '新北市': [
    '板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區',
    '土城區', '蘆洲區', '汐止區', '樹林區', '鶯歌區', '三峽區'
  ],
  '台中市': [
    '中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區',
    '南屯區', '太平區', '大里區', '霧峰區', '烏日區', '豐原區',
    '后里區', '大甲區'
  ],
  '台南市': [
    '中西區', '東區', '南區', '北區', '安平區', '安南區',
    '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區',
    '仁德區'
  ],
  '高雄市': [
    '楠梓區', '左營區', '鼓山區', '三民區', '鹽埕區', '前金區',
    '新興區', '苓雅區', '前鎮區', '小港區', '大寮區'
  ],
  '桃園市': [
    '桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區',
    '大溪區', '龍潭區', '龜山區', '大園區', '觀音區', '新屋區'
  ]
}
```

---

## 五、App 現有功能對照

### 5.1 認證功能

| 功能 | 說明 | 對應 API |
|------|------|----------|
| 登入 | Email + 密碼登入 | `POST /api/auth/login` |
| 註冊 | 三步驟註冊流程 | `POST /api/auth/register` |
| 登出 | 清除本地 Token | 前端處理 |

### 5.2 園區功能

| 功能 | 說明 | 對應 API |
|------|------|----------|
| 園區列表 | 顯示所有園區，支援地區篩選 | `GET /api/shelters` |
| 園區詳情 | 顯示園區完整資訊 | `GET /api/shelters/:id` |
| 地區篩選 | 縣市 + 區域二級篩選 | Query params |

### 5.3 個人資料功能

| 功能 | 說明 | 對應 API |
|------|------|----------|
| 查看個人資料 | 顯示用戶資訊 | 本地 Zustand 狀態 |
| 編輯個人資料 | 修改可編輯欄位 | `PATCH /api/auth/profile` |

---

## 六、後台功能需求

### 6.1 必要功能

| 功能 | 說明 |
|------|------|
| 管理員登入 | 單一管理員帳號登入（無註冊） |
| 園區管理 | 新增、編輯、刪除園區 |
| 園區列表 | 分頁、搜尋、篩選 |
| 用戶列表 | 查看所有 App 註冊用戶 |
| 用戶詳情 | 查看用戶完整資料 |

### 6.2 後台頁面結構

```
/login                    # 登入頁（唯一公開頁面）
/                         # 首頁（重定向到 /shelters）
/shelters                 # 園區列表
/shelters/new             # 新增園區
/shelters/[id]            # 園區詳情/編輯
/users                    # 用戶列表
/users/[id]               # 用戶詳情
```

---

## 七、設計規範

### 色彩系統

```typescript
const AppColors = {
  // 主色調
  primary: '#4A90E2',           // 天空藍
  primaryLight: '#F0F7FF',      // 極淺藍

  // 背景色
  background: '#F2F2F7',        // 系統灰
  surface: '#FFFFFF',           // 卡片白

  // 文字色
  textPrimary: '#333333',
  textSecondary: '#666666',
  textMuted: '#999999',

  // 邊界
  border: '#E5E5E5',
  divider: '#EEEEEE',

  // 標籤
  tagBackground: '#F0F0F0',
  tagText: '#666666',
}
```

### 設計原則

- 極簡風格：黑、白、灰 + 單一主色（藍 `#4A90E2`）
- 策略性使用主色標記重點（標題、按鈕、互動元素）
- 避免過多顏色造成視覺混亂

---

## 八、認證機制

### JWT Token 規格

```typescript
// Token Payload
interface TokenPayload {
  id: string;           // 用戶/管理員 ID
  email: string;
  type: 'user' | 'admin';
  iat: number;          // 簽發時間
  exp: number;          // 過期時間
}
```

### Token 處理

- 前端儲存：Zustand 狀態 + AsyncStorage（App）/ localStorage（後台）
- 請求帶入：`Authorization: Bearer {token}`
- 過期時間：建議 7 天
- 刷新機制：可選實作 Refresh Token

---

## 九、錯誤碼定義

| 錯誤碼 | 說明 |
|--------|------|
| `INVALID_CREDENTIALS` | 帳號或密碼錯誤 |
| `EMAIL_EXISTS` | Email 已被註冊 |
| `UNAUTHORIZED` | 未授權（Token 無效或過期） |
| `NOT_FOUND` | 資源不存在 |
| `VALIDATION_ERROR` | 資料驗證失敗 |

---

## 十、開發檢查清單

### API 對齊

- [ ] 實作 `POST /api/auth/login`（App 登入）
- [ ] 實作 `POST /api/auth/register`（App 註冊）
- [ ] 實作 `PATCH /api/auth/profile`（App 更新資料）
- [ ] 實作 `POST /api/admin/login`（後台登入）
- [ ] 實作 `GET /api/shelters`（園區列表）
- [ ] 實作 `GET /api/shelters/:id`（園區詳情）
- [ ] 實作 `POST /api/shelters`（新增園區）
- [ ] 實作 `PUT /api/shelters/:id`（更新園區）
- [ ] 實作 `DELETE /api/shelters/:id`（刪除園區）
- [ ] 實作 `GET /api/users`（用戶列表）
- [ ] 實作 `GET /api/users/:id`（用戶詳情）

### 資料驗證

- [ ] Email 格式驗證
- [ ] 密碼長度驗證（≥6 字元）
- [ ] 電話格式驗證（09xxxxxxxx）
- [ ] 未滿 18 歲緊急聯絡人必填

### 後台頁面

- [ ] 登入頁面
- [ ] 園區列表頁面
- [ ] 園區新增/編輯頁面
- [ ] 用戶列表頁面
- [ ] 用戶詳情頁面

---

## 附錄：範例資料

### 園區範例

```json
{
  "id": "1",
  "name": "浪浪天堂",
  "city": "台中市",
  "district": "太平區",
  "shortDescription": "位於台中山區的大型收容園區，目前收容超過200隻狗狗",
  "description": "我們是一群愛狗人士組成的志工團體，從2015年開始收容流浪狗。園區位於台中太平山區，環境清幽，讓毛孩們可以自由奔跑。",
  "tags": ["remote", "appointment"],
  "notices": {
    "requiresAppointment": true,
    "allowsDropIn": false,
    "acceptsVolunteers": true,
    "acceptsDonations": true,
    "specialNotes": "請穿著方便活動的服裝，山區蚊蟲較多請做好防護"
  },
  "contact": {
    "phone": "04-23456789",
    "line": "langlang_heaven",
    "facebook": "https://facebook.com/langlangtiantang"
  },
  "rules": [
    "請勿攜帶外食進入園區",
    "請勿擅自餵食園區狗狗",
    "拍照請勿使用閃光燈",
    "請聽從工作人員指示",
    "如有任何不適請立即告知工作人員"
  ]
}
```

### 使用者範例

```json
{
  "id": "1",
  "email": "test@example.com",
  "name": "測試用戶",
  "birthday": "2000-01-15T00:00:00.000Z",
  "gender": "male",
  "contactMethod": "phone",
  "phone": "0912345678",
  "lineId": "",
  "emergencyContact": "",
  "emergencyPhone": ""
}
```
