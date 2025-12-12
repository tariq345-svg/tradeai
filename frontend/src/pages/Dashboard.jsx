import { useState, useEffect } from 'react'
import StatsCards from '../components/StatsCards'
import PLChart from '../components/PLChart'
import EquityCurve from '../components/EquityCurve'
import MonthlyProfit from '../components/MonthlyProfit'
import RRDistribution from '../components/RRDistribution'
import CalendarHeatmap from '../components/CalendarHeatmap'
import { getStats, getTrades } from '../api/client'
import { Upload } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, tradesData] = await Promise.all([
        getStats(),
        getTrades({ limit: 1000 }),
      ])
      setStats(statsData)
      setTrades(tradesData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Successfully imported ${result.imported} trades`)
        loadData()
      } else {
        alert('Failed to upload file')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading file')
    } finally {
      setUploading(false)
      event.target.value = '' // Reset file input
    }
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload CSV/HTML'}
          <input
            type="file"
            accept=".csv,.html,.htm"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <StatsCards stats={stats} />

      {/* P/L Chart with Daily/Weekly/Monthly toggle */}
      <PLChart trades={trades} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EquityCurve data={stats?.equity_curve} />
        <MonthlyProfit trades={trades} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RRDistribution trades={trades} />
        <CalendarHeatmap />
      </div>

      {stats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Additional Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Winning Trades</p>
              <p className="text-xl font-semibold text-green-600">{stats.winning_trades}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Losing Trades</p>
              <p className="text-xl font-semibold text-red-600">{stats.losing_trades}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Profit</p>
              <p className="text-xl font-semibold text-green-600">${stats.total_profit?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Loss</p>
              <p className="text-xl font-semibold text-red-600">${stats.total_loss?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Max Drawdown</p>
              <p className="text-xl font-semibold text-red-600">${stats.max_drawdown?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Pips</p>
              <p className="text-xl font-semibold">{stats.average_pips?.toFixed(2)}</p>
            </div>
            {stats.best_day && (
              <div>
                <p className="text-sm text-gray-600">Best Day</p>
                <p className="text-xl font-semibold text-green-600">${stats.best_day.profit?.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{stats.best_day.date}</p>
              </div>
            )}
            {stats.worst_day && (
              <div>
                <p className="text-sm text-gray-600">Worst Day</p>
                <p className="text-xl font-semibold text-red-600">${stats.worst_day.profit?.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{stats.worst_day.date}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


