import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot, ReferenceLine } from 'recharts'
import { format, parseISO, startOfWeek, startOfMonth } from 'date-fns'

export default function PLChart({ trades }) {
  const [viewMode, setViewMode] = useState('daily') // 'daily', 'weekly', 'monthly'

  // Process trades into P/L data based on view mode
  const chartData = useMemo(() => {
    if (!trades || trades.length === 0) return []

    // Filter trades with exit times
    const completedTrades = trades.filter(t => t.exit_time && t.profit !== null)

    if (completedTrades.length === 0) return []

    // Group trades by period
    const groupedData = {}

    completedTrades.forEach(trade => {
      const exitDate = parseISO(trade.exit_time)
      let periodKey
      let periodLabel

      if (viewMode === 'daily') {
        periodKey = format(exitDate, 'yyyy-MM-dd')
        periodLabel = format(exitDate, 'MMM dd')
      } else if (viewMode === 'weekly') {
        const weekStart = startOfWeek(exitDate, { weekStartsOn: 1 })
        periodKey = format(weekStart, 'yyyy-MM-dd')
        periodLabel = `Week of ${format(weekStart, 'MMM dd')}`
      } else { // monthly
        const monthStart = startOfMonth(exitDate)
        periodKey = format(monthStart, 'yyyy-MM-dd')
        periodLabel = format(monthStart, 'MMM yyyy')
      }

      if (!groupedData[periodKey]) {
        groupedData[periodKey] = {
          date: periodKey,
          label: periodLabel,
          profit: 0,
          count: 0
        }
      }

      groupedData[periodKey].profit += trade.profit || 0
      groupedData[periodKey].count += 1
    })

    // Convert to array and sort by date
    const dataArray = Object.values(groupedData).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    )

    // Calculate cumulative P/L
    let cumulativePL = 0
    return dataArray.map(item => {
      cumulativePL += item.profit
      return {
        ...item,
        cumulativePL: cumulativePL,
        profit: item.profit,
        isProfit: item.profit >= 0
      }
    })
  }, [trades, viewMode])

  // Custom dot component - green for profit, red for loss
  const CustomDot = (props) => {
    const { cx, cy, payload } = props
    if (!payload) return null
    const isProfit = payload.isProfit
    return (
      <Dot
        cx={cx}
        cy={cy}
        r={5}
        fill={isProfit ? '#10b981' : '#ef4444'}
        stroke={isProfit ? '#059669' : '#dc2626'}
        strokeWidth={2}
      />
    )
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const isProfit = data.isProfit
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-1">{data.label}</p>
          <p className={`text-sm font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            P/L: ${data.profit.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Cumulative: ${data.cumulativePL.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            Trades: {data.count}
          </p>
        </div>
      )
    }
    return null
  }

  if (!trades || trades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Profit & Loss Chart</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Profit & Loss Chart</h3>
        <p className="text-gray-500 text-center py-8">No completed trades available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Profit & Loss Chart</h3>
        
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              viewMode === 'daily'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              viewMode === 'weekly'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              viewMode === 'monthly'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="label" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="2 2" />
          
          {/* Main smooth line with colored dots */}
          <Line
            type="monotone"
            dataKey="cumulativePL"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={(props) => {
              const { payload } = props
              if (!payload) return null
              const isProfit = payload.isProfit
              return (
                <Dot
                  {...props}
                  r={5}
                  fill={isProfit ? '#10b981' : '#ef4444'}
                  stroke={isProfit ? '#059669' : '#dc2626'}
                  strokeWidth={2}
                />
              )
            }}
            activeDot={(props) => {
              const { payload } = props
              if (!payload) return null
              const isProfit = payload.isProfit
              return (
                <Dot
                  {...props}
                  r={8}
                  fill={isProfit ? '#10b981' : '#ef4444'}
                  stroke={isProfit ? '#059669' : '#dc2626'}
                  strokeWidth={2}
                />
              )
            }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
