import React from 'react';
import AOS from 'aos';
import NavBar from './components/NavBar';

const App = () => {
  React.useEffect(() => {
    AOS.init({
        duration: 2000,
        easing: 'ease-in-out',
        once: true,
      });
  }, []);
  return (
    <div className ="overflow-hidden">
      Visa Climate Hack "Solution" Website
      <NavBar />
    </div>
  );
};

export default App