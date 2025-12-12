import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function RRDistribution({ trades }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">R:R Distribution</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    )
  }

  // Group trades by R:R ranges
  const ranges = [
    { range: '0-0.5', min: 0, max: 0.5 },
    { range: '0.5-1', min: 0.5, max: 1 },
    { range: '1-1.5', min: 1, max: 1.5 },
    { range: '1.5-2', min: 1.5, max: 2 },
    { range: '2-3', min: 2, max: 3 },
    { range: '3+', min: 3, max: Infinity },
  ]

  const distribution = ranges.map((r) => ({
    range: r.range,
    count: trades.filter(
      (t) => t.rr_ratio && t.rr_ratio >= r.min && t.rr_ratio < r.max
    ).length,
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">R:R Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={distribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}



