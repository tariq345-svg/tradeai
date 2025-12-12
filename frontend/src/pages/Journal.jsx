import { useState, useEffect } from 'react'
import { getTrades } from '../api/client'
import TradeModal from '../components/TradeModal'
import { Search, Filter, BookOpen } from 'lucide-react'
import { format } from 'date-fns'

export default function Journal() {
  const [trades, setTrades] = useState([])
  const [filteredTrades, setFilteredTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTrade, setSelectedTrade] = useState(null)
  const [filters, setFilters] = useState({
    symbol: '',
    direction: '',
    search: '',
  })

  useEffect(() => {
    loadTrades()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [trades, filters])

  const loadTrades = async () => {
    setLoading(true)
    try {
      const data = await getTrades({ limit: 1000 })
      setTrades(data)
      setFilteredTrades(data)
    } catch (error) {
      console.error('Failed to load trades:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...trades]

    if (filters.symbol) {
      filtered = filtered.filter((t) =>
        t.symbol.toLowerCase().includes(filters.symbol.toLowerCase())
      )
    }

    if (filters.direction) {
      filtered = filtered.filter((t) => t.direction === filters.direction)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.ticket.toString().includes(searchLower) ||
          t.symbol.toLowerCase().includes(searchLower) ||
          (t.notes && t.notes.toLowerCase().includes(searchLower)) ||
          (t.tags && t.tags.toLowerCase().includes(searchLower))
      )
    }

    setFilteredTrades(filtered)
  }

  const uniqueSymbols = [...new Set(trades.map((t) => t.symbol))].sort()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Trading Journal</h1>
        </div>
        <div className="text-sm text-gray-600">
          {filteredTrades.length} {filteredTrades.length === 1 ? 'entry' : 'entries'}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search trades..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={filters.symbol}
            onChange={(e) => setFilters({ ...filters, symbol: e.target.value })}
          >
            <option value="">All Symbols</option>
            {uniqueSymbols.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={filters.direction}
            onChange={(e) => setFilters({ ...filters, direction: e.target.value })}
          >
            <option value="">All Directions</option>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <button
            onClick={() => setFilters({ symbol: '', direction: '', search: '' })}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTrades.map((trade) => (
          <div
            key={trade.id}
            onClick={() => setSelectedTrade(trade)}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{trade.symbol}</h3>
                <p className="text-sm text-gray-500">Ticket #{trade.ticket}</p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  trade.direction === 'BUY'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {trade.direction}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Entry Price:</span>
                <span className="text-sm font-medium">{trade.entry_price?.toFixed(5)}</span>
              </div>
              {trade.exit_price && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Exit Price:</span>
                  <span className="text-sm font-medium">{trade.exit_price?.toFixed(5)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Profit:</span>
                <span
                  className={`text-sm font-semibold ${
                    trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  ${trade.profit?.toFixed(2) || '0.00'}
                </span>
              </div>
              {trade.rr_ratio && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">R:R:</span>
                  <span className="text-sm font-medium">{trade.rr_ratio?.toFixed(2)}</span>
                </div>
              )}
            </div>

            {trade.entry_time && (
              <div className="text-xs text-gray-500 mb-2">
                {format(new Date(trade.entry_time), 'MMM dd, yyyy HH:mm')}
              </div>
            )}

            {trade.notes && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-600 line-clamp-2">{trade.notes}</p>
              </div>
            )}

            {trade.tags && (
  <div className="mt-2 flex flex-wrap gap-1">
    {(trade.tags ? String(trade.tags).split(',').filter(Boolean) : []).map((tag, idx) => (
      <span
        key={idx}
        className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded"
      >
        {tag.trim()}
      </span>
    ))}
  </div>
)}
          </div>
        ))}
      </div>

      {filteredTrades.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No trades found matching your filters</p>
        </div>
      )}

      {selectedTrade && (
        <TradeModal
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
          onUpdate={loadTrades}
        />
      )}
    </div>
  )
}


