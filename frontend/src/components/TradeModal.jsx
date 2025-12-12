import { useState } from 'react'
import { X } from 'lucide-react'
import { format } from 'date-fns'
import { updateTrade } from '../api/client'

export default function TradeModal({ trade, onClose, onUpdate }) {
  const [notes, setNotes] = useState(trade?.notes || '')
  const [tags, setTags] = useState(trade?.tags || '')
  const [saving, setSaving] = useState(false)

  if (!trade) return null

  const feedback = [
    trade.rr_ratio && trade.rr_ratio >= 2.0 ? 'Good R:R above 2.0' : null,
    trade.risk_pips && trade.risk_pips < 10 ? 'Stop loss too tight' : null,
    trade.duration_minutes && trade.duration_minutes > 1440 ? 'Held too long' : null,
  ].filter(Boolean)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateTrade(trade.id, { notes, tags })
      if (onUpdate) onUpdate()
      onClose()
    } catch (error) {
      console.error('Failed to update trade:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Trade Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Ticket</label>
              <p className="text-lg">{trade.ticket}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Symbol</label>
              <p className="text-lg">{trade.symbol}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Direction</label>
              <p className={`text-lg font-semibold ${trade.direction === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                {trade.direction}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Lot Size</label>
              <p className="text-lg">{trade.lot_size}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Entry Price</label>
              <p className="text-lg">{trade.entry_price}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Exit Price</label>
              <p className="text-lg">{trade.exit_price || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Entry Time</label>
              <p className="text-lg">
                {trade.entry_time ? format(new Date(trade.entry_time), 'PPpp') : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Exit Time</label>
              <p className="text-lg">
                {trade.exit_time ? format(new Date(trade.exit_time), 'PPpp') : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Stop Loss</label>
              <p className="text-lg">{trade.stop_loss || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Take Profit</label>
              <p className="text-lg">{trade.take_profit || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Profit</label>
              <p className={`text-lg font-semibold ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${trade.profit?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Pips</label>
              <p className="text-lg">{trade.pips?.toFixed(2) || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">R:R Ratio</label>
              <p className="text-lg">{trade.rr_ratio?.toFixed(2) || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Duration</label>
              <p className="text-lg">
                {trade.duration_minutes ? `${Math.floor(trade.duration_minutes / 60)}h ${trade.duration_minutes % 60}m` : 'N/A'}
              </p>
            </div>
          </div>

          {feedback.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Feedback</h3>
              <ul className="list-disc list-inside space-y-1">
                {feedback.map((fb, idx) => (
                  <li key={idx} className="text-blue-800">{fb}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              className="w-full border rounded-lg p-2"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            disabled={saving}
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

