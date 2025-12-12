import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getCalendar } from '../api/client'

export default function CalendarHeatmap() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarData, setCalendarData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCalendarData()
  }, [currentMonth])

  const loadCalendarData = async () => {
    setLoading(true)
    try {
      const monthStr = format(currentMonth, 'yyyy-MM')
      const response = await getCalendar(monthStr)
      const dataMap = {}
      response.days.forEach((day) => {
        dataMap[day.date] = day
      })
      setCalendarData(dataMap)
    } catch (error) {
      console.error('Failed to load calendar data:', error)
    } finally {
      setLoading(false)
    }
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getColorClass = (profit) => {
    if (profit === undefined || profit === null) return 'bg-gray-100'
    if (profit > 0) {
      if (profit > 100) return 'bg-green-600'
      if (profit > 50) return 'bg-green-500'
      if (profit > 10) return 'bg-green-400'
      return 'bg-green-300'
    } else if (profit < 0) {
      if (profit < -100) return 'bg-red-600'
      if (profit < -50) return 'bg-red-500'
      if (profit < -10) return 'bg-red-400'
      return 'bg-red-300'
    }
    return 'bg-gray-200'
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Daily P/L Calendar</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={previousMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium w-32 text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd')
              const dayData = calendarData[dayStr]
              const profit = dayData?.profit || 0
              const tradesCount = dayData?.trades_count || 0

              return (
                <div
                  key={dayStr}
                  className={`${getColorClass(profit)} rounded p-2 min-h-[40px] flex flex-col items-center justify-center text-xs hover:opacity-80 cursor-pointer`}
                  title={`${format(day, 'MMM dd')}: $${profit.toFixed(2)} (${tradesCount} trades)`}
                >
                  <span className="font-medium">{format(day, 'd')}</span>
                  {profit !== 0 && (
                    <span className="text-xs mt-1">
                      {profit > 0 ? '+' : ''}${profit.toFixed(0)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-300 rounded mr-1"></div>
              <span>Loss</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
              <span>No Trades</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-300 rounded mr-1"></div>
              <span>Profit</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

