import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

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

const MonthlySpendChart = ({accountId}) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [hoveredMonth, setHoveredMonth] = useState(6);
  const [averageSpend, setAverageSpend] = useState(null);

  useEffect(() => {
    fetchMonthlySpend();  
    fetchOverallAvgSpend();
  }, []);

  const fetchMonthlySpend = () => {
    fetch('http://127.0.0.1:5000/api/monthly_spend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ account_id: accountId })  
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

  const fetchOverallAvgSpend = () => {
    axios.post('http://127.0.0.1:5000/api/overall_avg_spend', { account_id: accountId })
      .then(response => {
        if (response.data.success) {
          setAverageSpend(parseFloat(response.data.overall_avg_spend));
        }
      })
      .catch(error => {
        console.error('Error fetching overall average spend:', error);
        setError('Error fetching overall average spend');
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
      <h2 className='text-teal-900 font-semibold text-xl'>Spending Summary</h2>

      <h2>{monthNames[hoveredMonth]} Summary</h2>
      <p className='text-2xl'>${(parseFloat(currentMonthData.total)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <ResponsiveContainer width="100%" height={300}>
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
            formatter={(value) => `$${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            labelFormatter={(month) => monthNames[month]}
          />
          <Bar dataKey="total" fill="#008080" name="Total Spend" />
          {averageSpend && (
            <ReferenceLine 
              y={averageSpend} 
              stroke="grey" 
              strokeDasharray="5 5" 
            />
          )}
        </BarChart>
      </ResponsiveContainer>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <p>Spending Summary</p>
        <p>${parseFloat(currentMonthData.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <p style={{ fontWeight: '500' }}>Average Spending</p>
        <p style={{ color: 'teal', fontWeight: '500'  }}>${(averageSpend).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
    </div>
  );
};

export default MonthlySpendChart;
