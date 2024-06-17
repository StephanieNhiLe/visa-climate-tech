import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/messages');
        console.log('Connection is ' + response.data.message + '!');
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchAPI();
  }, []);

  // useEffect(() => {
  //   fetch('http://localhost:5000/api/messages')
  //     .then(response => response.json())
  //     .then(data => setMessage(data.message))
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <p>The message is {message}</p>
      </header>
    </div>
  );
}

export default App;
