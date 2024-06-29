import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formatYAxis = (value) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value;
};

const MonthlySpendChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.post('/api/monthly_spend', { account_id: '5a73582adf954cf6b3db6cc97bedccd9' }) // Will do Later: Auto fetch account_id from current user
      .then((response) => {
        if (response.data.success) {
          setData(response.data.monthly_spend);
        }
      })
      .catch((error) => {
        setError('An error occurred while fetching data.');
      });
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySpendChart;
