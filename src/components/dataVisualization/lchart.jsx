import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import mockweek from "../mockdata_weekly.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  tension: 0.4,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: '',
      font: {
        size: 16,
        weight: 'bold',
      },
    },
  },
};

export default function LineChart() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [title, setTitle] = useState('');

  useEffect(() => {
    const filteredData = mockweek.weekly_spending.filter(week => {
      const date = new Date(week.date);
      return date >= startDate && date <= endDate;
    });

    const categories = ["Food", "Entertainment", "Transportation", "wellness", "shopping"];
    const dates = filteredData.map((week) => week.date);
    const datasets = categories.map((category) => {
      return {
        label: category,
        data: filteredData.map((week) => week[category]),
        borderColor: getRandomColor(),
        backgroundColor: getRandomColor(0.5),
      };
    });

    setChartData({ labels: dates, datasets });


    setTitle(`Date Range: ${formatDate(startDate)} - ${formatDate(endDate)}`);
  }, [startDate, endDate]);

  const getRandomColor = (opacity = 1) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},${opacity})`;
  };

  const formatDate = (date) => {
    try {
      date = new Date(date);
      if (date === null) {
        return '';
      }
      else {
        return date.toLocaleDateString();
      }
    }
    catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }  
  };

  return (
    <div>
      <h2>{title}</h2>
      <div className = "m-5 space-x-5">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="End Date"
        />
      </div>
      <div>
        
        <div style={{flex:"flex-grow", position: "relative", margin: "auto", height: "screen", width: "150%" }} >
          <Line options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: title } } }} data={chartData} />
        </div>
      </div>
    </div>
  );
}
