import './App.css';
import React, { useEffect, useState } from 'react'; 

function App() {
  const [message, setMessage] = useState('Loading...');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    fetchAccessToken();
  }, []);
  
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
    <div className="App">
      <header className="App-header">
        <p>The message is {message}</p>
      </header>
    </div>
  );
}

export default App;
