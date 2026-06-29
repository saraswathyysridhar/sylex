import { createContext, useContext, useState } from 'react'

const FilterContext = createContext(null)

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  return (
    <FilterContext.Provider value={{ filters, updateFilters, clearFilters, searchQuery, setSearchQuery }}>
      {children}
    </FilterContext.Provider>
  )
}

export const useFilters = () => {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilters must be used within FilterProvider')
  return ctx
}
