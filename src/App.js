import './App.css';
import React, { useEffect, useState } from 'react'; 
import { BrowserRouter, Link, Routes, Route, Navigate} from 'react-router-dom';
import Sidebar from './components/sidebar';
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';
import Analytics from './pages/Analytics';
import Transactions from './pages/Transactions';
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

  // Test API Message - Sample 
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
              <><Dashboard /><div className={!navVisible ? "page" : "page with-sidebar"}>
              </div></>
            } />
            <Route path='/activity' element={
              <><Activity /><div className={!navVisible ? "page" : "page with-sidebar"}>
                <h1 className={'flex font-bold text-3xl text-teal-950 ml-60 p-6 space-y-6 md:space-y-0 md:space-x-6'}>Activity</h1>
              </div></>
            }/>
            <Route path='/analytics' element={
              <><Analytics /><div className={!navVisible ? "page" : "page with-sidebar"}>
                <h1 className={'flex font-bold text-3xl text-teal-950 ml-60 p-6 space-y-6 md:space-y-0 md:space-x-6'}>Analytics</h1>
              </div></>
            }/>
            <Route path='/transactions' element={<> <Transactions />
              <div className={!navVisible ? "page" : "page with-sidebar"}>
                <h1 className={'flex font-bold text-3xl text-teal-950 ml-60 p-6 space-y-6 md:space-y-0 md:space-x-6'}>Transactions</h1>
              </div></>
            }/>
                <Route path='/logout' element={
              <div className={!navVisible ? "page" : "page with-sidebar"}>
                <h1 className={'flex font-bold text-3xl text-teal-950 ml-60 p-6 space-y-6 md:space-y-0 md:space-x-6'}>Logout</h1>
              </div>
            }/>
          </Routes>
        </div> 
      </BrowserRouter>
    </div>
  );
}

export default App;
