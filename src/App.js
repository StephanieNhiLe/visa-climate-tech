import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:5000/api/data', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setData(data.message))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  
  

  return (
    <div className="App">
      <header className="App-header">
        <p>The message is {data}</p>
      </header>
    </div>
  );
}

export default App;
