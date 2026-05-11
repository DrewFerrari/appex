"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  type: 'course' | 'article' | 'video' | 'faq'
  url: string
  description?: string
  thumbnail?: string
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      // Mock search results for now - replace with actual API call
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "Getting Started with AppEx Retail",
          type: "course",
          url: "/courses/getting-started-retail",
          description: "Learn the basics of AppEx Retail Management System",
        },
        {
          id: "2",
          title: "POS Operations Guide",
          type: "article",
          url: "/docs/pos-operations",
          description: "Complete guide to Point of Sale operations",
        },
        {
          id: "3",
          title: "Inventory Management Tutorial",
          type: "video",
          url: "/videos/inventory-management",
          description: "Video tutorial on managing inventory",
        },
      ]
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setResults(mockResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ))
      setIsOpen(true)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        setIsOpen(false)
      }
    }
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'course':
        return "🎓"
      case 'article':
        return "📄"
      case 'video':
        return "🎥"
      case 'faq':
        return "❓"
      default:
        return "📄"
    }
  }

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'course':
        return "text-emerald-600 bg-emerald-50"
      case 'article':
        return "text-blue-600 bg-blue-50"
      case 'video':
        return "text-purple-600 bg-purple-50"
      case 'faq':
        return "text-orange-600 bg-orange-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div ref={searchRef} className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search courses, guides, videos..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            handleSearch(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
          className="w-full pl-10 pr-4 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500"
        />
        <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded hidden md:block">
          ⌘K
        </kbd>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Search Results
              </div>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    router.push(result.url)
                    setIsOpen(false)
                    setQuery("")
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start space-x-3"
                >
                  <span className="text-lg">{getTypeIcon(result.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        getTypeColor(result.type)
                      )}>
                        {result.type}
                      </span>
                    </div>
                    {result.description && (
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {result.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try different keywords or browse our categories</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
