"use client"

import { useState, useMemo } from "react"
import { Plus, Search } from "lucide-react"
import { useShelterStore } from "@/stores/shelter-store"
import { CITIES, getDistrictsByCity } from "@/lib/constants"
import { SHELTER_TAG_LABELS, type ShelterDetail } from "@/types"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ShelterDialog } from "@/components/shelters/shelter-dialog"

const ITEMS_PER_PAGE = 10

export default function SheltersPage() {
  const { shelters, addShelter, updateShelter, deleteShelter } = useShelterStore()

  // 篩選狀態
  const [search, setSearch] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [districtFilter, setDistrictFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Dialog 狀態
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedShelter, setSelectedShelter] = useState<ShelterDetail | null>(null)

  // 篩選邏輯
  const filteredShelters = useMemo(() => {
    return shelters.filter((shelter) => {
      const matchesSearch =
        search === "" ||
        shelter.name.toLowerCase().includes(search.toLowerCase())
      const matchesCity = cityFilter === "" || shelter.city === cityFilter
      const matchesDistrict =
        districtFilter === "" || shelter.district === districtFilter
      return matchesSearch && matchesCity && matchesDistrict
    })
  }, [shelters, search, cityFilter, districtFilter])

  // 分頁邏輯
  const totalPages = Math.ceil(filteredShelters.length / ITEMS_PER_PAGE)
  const paginatedShelters = filteredShelters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // 區域選項
  const districts = cityFilter ? getDistrictsByCity(cityFilter) : []

  const handleCityChange = (city: string) => {
    setCityFilter(city)
    setDistrictFilter("")
    setCurrentPage(1)
  }

  const handleRowClick = (shelter: ShelterDetail) => {
    setSelectedShelter(shelter)
    setDialogOpen(true)
  }

  const handleAddClick = () => {
    setSelectedShelter(null)
    setDialogOpen(true)
  }

  const handleSave = (shelter: ShelterDetail) => {
    if (selectedShelter) {
      updateShelter(shelter.id, shelter)
    } else {
      addShelter(shelter)
    }
  }

  const handleDelete = (id: string) => {
    deleteShelter(id)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="園區管理" />
      <div className="flex-1 p-6 space-y-6">
        {/* 工具列 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜尋 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜尋園區名稱..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9 w-64"
              />
            </div>
            {/* 縣市篩選 */}
            <Select
              value={cityFilter}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-40"
            >
              <option value="">所有縣市</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
            {/* 區域篩選 */}
            <Select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-40"
              disabled={!cityFilter}
            >
              <option value="">所有區域</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </Select>
          </div>
          {/* 新增按鈕 */}
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            新增園區
          </Button>
        </div>

        {/* 表格 */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>園區名稱</TableHead>
                <TableHead>縣市</TableHead>
                <TableHead>區域</TableHead>
                <TableHead>標籤</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedShelters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    沒有找到符合條件的園區
                  </TableCell>
                </TableRow>
              ) : (
                paginatedShelters.map((shelter) => (
                  <TableRow
                    key={shelter.id}
                    className="cursor-pointer"
                    onClick={() => handleRowClick(shelter)}
                  >
                    <TableCell className="font-medium">{shelter.name}</TableCell>
                    <TableCell>{shelter.city}</TableCell>
                    <TableCell>{shelter.district}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {shelter.tags.map((tag) => (
                          <Badge key={tag} variant="tag">
                            {SHELTER_TAG_LABELS[tag]}
                          </Badge>
                        ))}
                        {shelter.tags.length === 0 && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
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

      {/* 園區 Dialog */}
      <ShelterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        shelter={selectedShelter}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
