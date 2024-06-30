import './App.css';
import React, { useEffect, useState } from 'react'; 
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Sidebar from './components/sidebar';
import MonthlySpendChart from './components/dataVisualization/MonthlySpendChart';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [accessToken, setAccessToken] = useState('');
  const [monthlySpend, setMonthlySpend] = useState([]);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    fetchAccessToken();
  }, []);
  
  // Ecolytiq Token Access
  const fetchAccessToken = () => {
    fetch('http://127.0.0.1:5000/api/get_access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
      if (data.access_token) {
        setAccessToken(data.access_token);
        fetchMessage(data.access_token); 
      } else {
        console.error('Failed to fetch access token');
      }
    })
    .catch(error => console.error('Error fetching access token:', error));
  };

  // Test API Message
  const fetchMessage = (token) => {
    fetch('http://127.0.0.1:5000/api/messages', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => setMessage(data.message))
    .catch(error => console.error('Error fetching message:', error));
  };
 

  return (
    <div>
      <BrowserRouter>
      	<div className="Sidebar">
				  <Sidebar visible={ navVisible } show={setNavVisible} />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path='/dashboard' element={
              <div className={!navVisible ? "page" : "page with-sidebar"}>
                <h1>Dashboard</h1>
              </div>
            } />
            <Route path='/activity' element={
              <div className={!navVisible ? "page" : "page with-sidebar"}>
                <h1>Activity</h1>
              </div>
            }/>
            <Route path='/analytics' element={
              <div className={!navVisible ? "page" : "page with-sidebar"}>
                <h1>Analytics</h1>
              </div>
            }/>
            <Route path='/transactions' element={
              <div className={!navVisible ? "page" : "page with-sidebar"}>
                <h1>Transactions</h1>
              </div>
            }/>
                <Route path='/logout' element={
              <div className={!navVisible ? "page" : "page with-sidebar"}>
                <h1>Logout</h1>
              </div>
            }/>
          </Routes>
        </div>
        <div>
          <h1 className='flex font-bold text-3xl text-teal-950 ml-60 p-6 space-y-6 md:space-y-0 md:space-x-6'>Dashboard</h1>
        </div>
        <div className="flex flex-row justify-around ml-60 p-6 space-y-6 md:space-y-0 md:space-x-6">

          {/* Financial Trend Section */}
          <div className="flex flex-col space-between ml-150% w-50 md:w-1/3 h-64 p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-semibold mb-4">Spending Planner</h1>
            <h2 className='text-slate-400 font-semibold'>Spending Summary</h2>
            <MonthlySpendChart /> 
            <div className="flex-grow text-wrap flex items-center justify-center">
            <p>Content for Financial Trend</p>
            </div>
          </div>

          {/* Carbon Footprint AI Prompt Facts Section */}
          <div className="flex flex-row space-between w-50 ml-120% md:w-1/3 h-64 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Carbon Footprint AI Prompt Facts</h2>
            <div className="flex-grow text-wrap flex items-center justify-center">
            {/* Insert your Carbon Footprint AI Prompt Facts content here */}
            <p>Content for Carbon Footprint AI Prompt Facts</p>
            </div>
          </div>

          {/* Recommerce Business Suggestions Section */}
          <div className="flex flex-row space-between items-center w-50 md:w-1/3 h-64 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recommerce Business Suggestions</h2>
            <div className="flex-grow text-wrap flex items-center justify-center">
            {/* Insert your Recommerce Business Suggestions content here */}
            <p>Content for Recommerce Business Suggestions</p>
          </div>
            </div>
              {/* <div className="App">
              <header className="App-header">
                <p>The message is {message}</p>
              </header>
            </div> */}
        </div>
      </BrowserRouter>
      {/* <div className="App">
        <h1>Monthly Spend Summary</h1>
        <MonthlySpendChart /> 
      </div> */}
    </div>
  );
}

export default App;
