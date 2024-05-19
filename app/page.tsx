"use client";

import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';
import { ApiError } from './types';
import SymbolInput from './SymbolInput';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement
);

interface Quote {
  timestamp: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Price {
  timestamp: string;
  symbol: string;
  bidSize: number;
  bidPrice: number;
  askPrice: number;
  askSize: number;
}

const Home = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState('XBT');
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/hello2/${symbol}`);
        console.log(`${symbol+"USD"}`);
        const response2 = await fetch(`/api/hello/${symbol+"USD"}`);
        if (!response.ok || !response2.ok) {
          const errorText: string = await response.text();
          console.error('API Error:', errorText);
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const data2 = await response2.json();
        setQuotes(data);
        setPrices(data2);
      } catch (error: any) {
        setError({ error: 'FetchError', message: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const barData = {
    labels: prices.map(price => new Date(price.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Bid Price',
        data: prices.map(price => price.bidPrice),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Ask Price',
        data: prices.map(price => price.askPrice),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'BitMEX Data for the Last 30 Days',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price',
        },
      },
    },
  };

  const candlestickData = {
    datasets: [
      {
        label: `${symbol} Candlestick`,
        data: quotes.map(quote => ({
          x: new Date(quote.timestamp),
          o: quote.open,
          h: quote.high,
          l: quote.low,
          c: quote.close,
        })),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const candlestickOptions: ChartOptions<'candlestick'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Candlestick Chart for ${symbol}`,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price',
        },
      },
    },
  };
  const averageBidSize = prices.reduce((acc, price) => acc + price.bidSize, 0) / prices.length;
  const averageAskSize = prices.reduce((acc, price) => acc + price.askSize, 0) / prices.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <h1 style={{ marginBottom: '20px' }}>BitMEX Data for the Last 30 Days</h1>
  <SymbolInput onSymbolSelect={setSymbol} />
  
  <div style={{ width: '800px', height: '600px', marginTop: '20px' }}>
    <Chart type='candlestick' data={candlestickData} options={candlestickOptions} />
  </div>
  
  <div style={{ width: '600px', height: '400px', marginTop: '20px' }}>
    <Bar data={barData} options={barOptions} />
  </div>
  
  <div style={{ width: '600px', marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
    <h2 style={{ marginBottom: '10px', textAlign: 'center' }}>Average Prices</h2>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ marginBottom: '5px' }}>Average Bid Size:</p>
        <h3>{averageBidSize.toFixed(2)}</h3>
      </div>
      <div>
        <p style={{ marginBottom: '5px' }}>Average Ask Size:</p>
        <h3>{averageAskSize.toFixed(2)}</h3>
      </div>
    </div>
  </div>
</div>
  );
};

export default Home;
