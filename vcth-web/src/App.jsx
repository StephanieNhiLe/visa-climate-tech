import { useState, useEffect } from 'react';
// import AOS from 'aos'; // react aos scroll animation
import './App.css';
import axios from 'axios';
import NavBar from './components/NavBar';

function App(){
  const [message, setMessage] = useState('Loading.....');
  // useEffect(() => {
  //   AOS.init({
  //       duration: 2000,
  //       easing: 'ease-in-out',
  //       once: true,
  //     });
  // }, []);

  const fetchAPI = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/messages');
      console.log('Connection is ' + response.data.message + '!');
      setMessage(response.data.message);
    }
    catch (error) {
      console.error('Error fetching data:',error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div className ="overflow-hidden">
      <h1 className='Title'>
      Visa Climate Hack "Solution" Website
      </h1>
      <br>
      </br>
      <NavBar />
      <br>
      </br>
        <div className="App"><header className="App-header">
          <p>The Connection is {message}</p>
        </header>
        </div>
        <br>
      </br>
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h2>Our Mission</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae velit fugit accusantium vel earum illum, quasi, quia distinctio temporibus necessitatibus totam. Consequuntur tenetur, veniam illum veritatis placeat aspernatur quo molestiae!
                </p>
              </div>
              <br>
              </br>
              <div className="col-md-6">
                <h2>Our Partners</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae velit fugit accusantium vel earum illum, quasi, quia distinctio temporibus necessitatibus totam. Consequuntur tenetur, veniam illum veritatis placeat aspernatur quo molestiae!
                </p>
              </div>
            </div>
      </div>
    </div>
  );
};

export default App