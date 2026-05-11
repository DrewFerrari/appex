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

interface CourseFiltersProps {
  businessTypes: string[]
  levels: string[]
}

export function CourseFilters({ businessTypes, levels }: CourseFiltersProps) {
  const [selectedBusinessType, setSelectedBusinessType] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const activeFiltersCount = [
    selectedBusinessType !== "All",
    selectedLevel !== "All", 
    searchQuery.trim() !== ""
  ].filter(Boolean).length

  const clearFilters = () => {
    setSelectedBusinessType("All")
    setSelectedLevel("All")
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
              placeholder="Search courses..."
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
          <Select value={selectedBusinessType} onValueChange={(val) => setSelectedBusinessType(val || "All")}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Business Type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={(val) => setSelectedLevel(val || "All")}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
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
          <Select value={selectedBusinessType} onValueChange={(val) => setSelectedBusinessType(val || "All")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Business Type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={(val) => setSelectedLevel(val || "All")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
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
          {selectedBusinessType !== "All" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Business: {selectedBusinessType}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSelectedBusinessType("All")}
              />
            </Badge>
          )}
          {selectedLevel !== "All" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Level: {selectedLevel}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSelectedLevel("All")}
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
