"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"

interface DocumentationFiltersProps {
  categories: { value: string; label: string }[]
  businessTypes: { value: string; label: string }[]
}

export function DocumentationFilters({ categories, businessTypes }: DocumentationFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBusinessType, setSelectedBusinessType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedBusinessType !== "all", 
    searchQuery.trim() !== ""
  ].filter(Boolean).length

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedBusinessType("all")
    setSearchQuery("")
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters Toggle (Mobile) */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Desktop Filters */}
        <div className="hidden lg:flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val || "all")}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedBusinessType} onValueChange={(val) => setSelectedBusinessType(val || "all")}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Business Type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-4">
          <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val || "all")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedBusinessType} onValueChange={(val) => setSelectedBusinessType(val || "all")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Business Type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" onClick={clearFilters} className="w-full">
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {categories.find(c => c.value === selectedCategory)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSelectedCategory("all")}
              />
            </Badge>
          )}
          {selectedBusinessType !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Business: {businessTypes.find(t => t.value === selectedBusinessType)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSelectedBusinessType("all")}
              />
            </Badge>
          )}
          {searchQuery.trim() !== "" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchQuery}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSearchQuery("")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
