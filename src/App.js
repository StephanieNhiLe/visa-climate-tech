import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  // useEffect(() => {
  //   fetch('/api/data')
  //     .then((response) => response.json())
  //     .then((data) => setData(data.message));
  // }, []);

  useEffect(() => {
    fetch('/api/data')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();  
      })
      .then((text) => {
        return text.length ? JSON.parse(text) : {}; 
      })
      .then((data) => setData(data.message))
      .catch((error) => console.error('There was a problem with your fetch operation:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;
