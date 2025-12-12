import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react'

export default function StatsCards({ stats }) {
  if (!stats) return null

  const cards = [
    {
      title: 'Net Profit',
      value: `$${stats.net_profit?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: stats.net_profit >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.net_profit >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      title: 'Win Rate',
      value: `${stats.win_rate?.toFixed(1) || '0'}%`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Trades',
      value: stats.total_trades || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Avg R:R',
      value: stats.average_rr?.toFixed(2) || 'N/A',
      icon: TrendingDown,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg shadow p-6`}
          >
            <div className="flex items-center">
              <div className={`${card.color} p-3 rounded-md`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-semibold ${card.color}`}>
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}



