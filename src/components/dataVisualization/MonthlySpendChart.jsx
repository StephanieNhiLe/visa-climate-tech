import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formatYAxis = (value) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value;
};

const monthNames = {
  5: 'May',
  6: 'June',
  7: 'July'
};

const MonthlySpendChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [hoveredMonth, setHoveredMonth] = useState(6);

  useEffect(() => {
    fetchMonthlySpend();  
  }, []);

  const fetchMonthlySpend = () => {
    fetch('http://127.0.0.1:5000/api/monthly_spend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ account_id: '5a73582adf954cf6b3db6cc97bedccd9' }) // Make sure to use the correct account_id
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(responseData => {
      console.log('Received data:', responseData);
      if (responseData.success) {
        setData(responseData.monthly_spend);
      } else {
        setError('Failed to fetch monthly spend data');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setError('Error fetching monthly spend data');
    });
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (data.length === 0) {
    return <p>Loading...</p>;
  }

  const currentMonthData = data.find(item => item.month === hoveredMonth) || data[1];

  return (
    <div>
      <h2>{monthNames[hoveredMonth]} Summary</h2>
      <p>Total Spend: {formatYAxis(parseFloat(currentMonthData.total))}</p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 20, bottom: 5 }}
          onMouseMove={(state) => {
            if (state.isTooltipActive) {
              setHoveredMonth(state.activePayload[0].payload.month);
            }
          }}
          onMouseLeave={() => setHoveredMonth(6)}
        >
          <XAxis dataKey="month" tickFormatter={(month) => monthNames[month]}/>
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip 
            formatter={(value) => `$${parseFloat(value).toFixed(2)}`} 
            labelFormatter={(month) => monthNames[month]}
          />
          <Legend />
          <Bar dataKey="total" fill="#008080" name="Total Spend" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySpendChart;
