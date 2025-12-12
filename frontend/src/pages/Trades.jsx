import React, { useState, useEffect } from 'react';
import { getTrades } from '../api/client';

const Trades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const data = await getTrades();
        console.log('Fetched trades:', data); // Add this line for debugging
        setTrades(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load trades. Please try again.');
        console.error('Error fetching trades:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  if (loading) {
    return <div className="p-4">Loading trades...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Trades</h1>
      {trades.length === 0 ? (
        <p>No trades found. Start by adding your first trade.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Symbol</th>
                <th className="py-2 px-4 border">Type</th>
                <th className="py-2 px-4 border">Entry</th>
                <th className="py-2 px-4 border">Exit</th>
                <th className="py-2 px-4 border">P/L</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{trade.symbol}</td>
                  <td className="py-2 px-4 border">{trade.tradeType}</td>
                  <td className="py-2 px-4 border">{trade.entryPrice}</td>
                  <td className="py-2 px-4 border">{trade.exitPrice || '-'}</td>
                  <td 
                    className={`py-2 px-4 border ${
                      trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {trade.profitLoss ? `$${trade.profitLoss.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Trades;
