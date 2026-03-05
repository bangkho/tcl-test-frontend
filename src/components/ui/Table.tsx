import { useState, useMemo } from 'react'
import { Edit, Trash2, Search, ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react'

type SortDirection = 'asc' | 'desc' | null

interface Column<T> {
  key: keyof T | 'actions'
  header: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  emptyMessage?: string
  searchable?: boolean
  searchPlaceholder?: string
  pageSize?: number
}

export function Table<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  emptyMessage = 'No data available',
  searchable = false,
  searchPlaceholder = 'Search...',
  pageSize = 10,
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  // Handle sort
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortKey(null)
        setSortDirection(null)
      }
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((item) =>
        columns
          .filter((col) => col.key !== 'actions')
          .some((col) => {
            const value = item[col.key as keyof T]
            return String(value).toLowerCase().includes(query)
          })
      )
    }

    // Sort
    if (sortKey && sortDirection) {
      result.sort((a, b) => {
        const aValue = a[sortKey as keyof T]
        const bValue = b[sortKey as keyof T]

        if (aValue === bValue) return 0
        if (aValue === undefined || aValue === null) return 1
        if (bValue === undefined || bValue === null) return -1

        const comparison = aValue < bValue ? -1 : 1
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    return result
  }, [data, searchQuery, sortKey, sortDirection, columns])

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize)
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Reset page if out of bounds
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages)
  }

  const sortableColumns = columns.filter((col) => col.sortable !== false && col.key !== 'actions')

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchable && (
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {processedData.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {emptyMessage}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                {columns.map((column) => {
                  const isSortable = sortableColumns.some((col) => col.key === column.key)
                  const isActive = sortKey === String(column.key)

                  return (
                    <th
                      key={String(column.key)}
                      className={`px-4 py-3 text-left text-sm font-medium text-gray-300 ${
                        isSortable ? 'cursor-pointer hover:text-white select-none' : ''
                      }`}
                      onClick={() => isSortable && handleSort(String(column.key))}
                    >
                      <div className="flex items-center gap-1">
                        {column.header}
                        {isSortable && (
                          <span className="ml-1">
                            {isActive && sortDirection === 'asc' ? (
                              <ChevronUp size={14} />
                            ) : isActive && sortDirection === 'desc' ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronUp size={14} className="opacity-30" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-700/50 hover:bg-gray-700/20"
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3 text-sm text-gray-300">
                      {((column.key === 'actions') && (!column.render)) ? (
                        <div className="flex items-center gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 rounded-md bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="p-1.5 rounded-md bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ) : column.render ? (
                        column.render(item)
                      ) : (
                        String(item[column.key as keyof T] ?? '')
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-400">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, processedData.length)} of{' '}
            {processedData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
              title="First page"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-300 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next page"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Last page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
