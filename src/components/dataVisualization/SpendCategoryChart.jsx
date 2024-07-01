import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const SpendCategoryChart = ({ accountId }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(6);
  const [error, setError] = useState(null);
  const [highestSpentCategory, setHighestSpentCategory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/monthly_spend_by_category', { account_id: accountId });
        console.log('API response:', response.data);

        if (response.data.success) {
          const data = response.data.monthly_spend_by_category_percent;
          const highestSpent = response.data.highest_spent_category;
          if (data && Array.isArray(data) && data.length > 0) {
            setChartData(data);
          } else {
            console.error('Undefined or empty:', data);
            setError('Undefined or empty');
          }
          if (highestSpent && Array.isArray(highestSpent) && highestSpent.length > 0) {
            setHighestSpentCategory(highestSpent);
          } else {
            console.error('Undefined or empty:', highestSpent);
            setError('Undefined or empty');
          }
        } else {
          setError(response.data.message || 'An error occurred while fetching data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.message || error.message || 'An error occurred while fetching data');
      }
    };

    fetchData();
  }, [accountId]);

  const processDataForChart = (data) => {
    const monthData = data.find(item => item.month === selectedMonth);
    if (!monthData) return [];

    return Object.entries(monthData)
      .filter(([key]) => key !== 'month')
      .map(([category, percentage]) => ({
        category,
        percentage: percentage || 0  
      }))
      .sort((a, b) => b.percentage - a.percentage);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  if (chartData.length === 0) {
    return (
      <div>
        {error ? <p>Error: {error}</p> : <p>Loading...</p>}
      </div>
    );
  }

  const processedData = processDataForChart(chartData);
  const highestCategoryData = highestSpentCategory.find(item => item.month === selectedMonth);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 className='text-teal-900 font-semibold text-xl pb-3'>Category Details</h3>
      <div style={{ flex: 1 }}>
        <div style={{ flex: 1, paddingInline: 10, flexDirection: 'row-reverse', display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}> 
        <select value={selectedMonth} onChange={handleMonthChange}>
          {chartData.map(item => (
            <option key={item.month} value={item.month}>
              {new Date(2023, item.month - 1).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        {highestCategoryData && (
          <div style={{ marginTop: '20px'}}>
            <h4>You spent the most on</h4>
            <strong>{highestCategoryData.re_category}:</strong> ${highestCategoryData.amount.toLocaleString()}
          </div>
        )}
      </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical"
            data={processedData}
            margin={{ top: 20, right: 30, left: 120, bottom: 5 }} 
          >
            <XAxis type="number" domain={[0, 50]} />
            <YAxis type="category" dataKey="category" />
            <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />  
            {Object.keys(processedData[0]).filter(key => key !== 'category').map((key, index) => (
              <Bar key={key} dataKey={key} stackId="a" fill='#008080' />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
};

export default SpendCategoryChart;
