import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format, parseISO } from 'date-fns'

export default function MonthlyProfit({ trades }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Profit</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    )
  }

  // Group trades by month
  const monthlyData = {}
  trades.forEach((trade) => {
    if (trade.exit_time) {
      const date = parseISO(trade.exit_time)
      const monthKey = format(date, 'yyyy-MM')
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: format(date, 'MMM yyyy'), profit: 0 }
      }
      monthlyData[monthKey].profit += trade.profit || 0
    }
  })

  const chartData = Object.values(monthlyData).sort((a, b) => {
    return new Date(a.month) - new Date(b.month)
  })

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Profit</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`$${value.toFixed(2)}`, 'Profit']}
          />
          <Legend />
          <Bar dataKey="profit" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

