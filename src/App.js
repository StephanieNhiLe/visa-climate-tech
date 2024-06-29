import './App.css';
import React, { useEffect, useState } from 'react'; 
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Sidebar from './components/sidebar';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/messages')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  
  return (
    <>
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
			<div className="flex flex-row justify-around ml-60 p-6 space-y-6 md:space-y-0 md:space-x-6">
				{/* Financial Trend Section */}
				<div className="flex flex-start space-between items-center ml-150% w-50 md:w-1/3 h-64 p-4 bg-gray-100 rounded  shadow-md">
					<h2 className="text-xl font-semibold mb-4">Financial Trend</h2>
					<div className="flex-grow text-wrap flex items-center justify-center">
					{/* Insert your Financial Trend content here */}
					<p>Content for Financial Trend</p>
					</div>
				</div>

				{/* Carbon Footprint AI Prompt Facts Section */}
				<div className="flex flex-row space-between w-50 ml-120% md:w-1/3 h-64 p-4 bg-gray-100 rounded shadow-md">
					<h2 className="text-xl font-semibold mb-4">Carbon Footprint AI Prompt Facts</h2>
					<div className="flex-grow text-wrap flex items-center justify-center">
					{/* Insert your Carbon Footprint AI Prompt Facts content here */}
					<p>Content for Carbon Footprint AI Prompt Facts</p>
					</div>
				</div>

				{/* Recommerce Business Suggestions Section */}
				<div className="flex flex-row space-between items-center w-50 md:w-1/3 h-64 p-4 bg-gray-100 rounded shadow-md">
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
    </>
  );
}

export default App;
