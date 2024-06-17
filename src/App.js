import './App.css';
import React, { useEffect, useState } from 'react'; 

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/messages')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <p>The message is {message}</p>
      </header>
    </div>
  );
}

export default App;
