import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// Update this URL to your backend server's URL
const socket = io('http://localhost:5000');

function App() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);

  // Fetch stock data using Fetch API
  const fetchStockData = async () => {
    try {
      const response = await fetch(`/api/stock/${symbol}`);
      if (response.ok) {
        const data = await response.json();
        setStockData(data);
      } else {
        console.error('Error fetching stock data', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching stock data', error);
    }
  };

  // Handle real-time stock updates via Socket.io
  useEffect(() => {
    socket.on('stockData', (data) => {
      setRealTimeData(data);
    });

    return () => {
      socket.off('stockData'); // Clean up the subscription on component unmount
    };
  }, []);

  // Handle subscribing to real-time data
  const handleRealTimeSubscription = () => {
    socket.emit('subscribeToStock', symbol);
  };

  return (
    <div className="container">
      <h1 className="title">Stock Market App</h1>

      <input
        type="text"
        className="input"
        placeholder="Enter Stock Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
      />
      <div className="button-container">
        <button className="btn fetch-btn" onClick={fetchStockData}>
          Fetch Stock Data
        </button>
        <button className="btn subscribe-btn" onClick={handleRealTimeSubscription}>
          Subscribe to Real-Time Data
        </button>
      </div>

      {stockData && (
        <div className="card">
          <h2>Stock Data for {symbol}</h2>
          <pre>{JSON.stringify(stockData, null, 2)}</pre>
        </div>
      )}

      {realTimeData && (
        <div className="card">
          <h2>Real-Time Data for {symbol}</h2>
          <pre>{JSON.stringify(realTimeData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
