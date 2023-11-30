import React from 'react';
// import '../Homepage.css';
// import diabeticImage from './diabetic.png'; <img src={diabeticImage} alt="Diabetic" />

const Homepage = ({ handleNavigation }) => {
  return (
    <div className="homepage-container">
      <header className="header">
        <div className="logo">PaxPal</div>
        <button onClick={() => handleNavigation('login')}>LogIn/SignUp</button>
      </header>
      <div className="content">
        <div className="main-content">
          <h1>Manage Your Diabetic Levels with PaxPal</h1>
          <p>Track your blood sugar levels, log your meals, and lead a healthier life with PaxPal.</p>
          <button onClick={() => handleNavigation('login')}>Get Started</button>
        </div>
        <div className="image-content">
          
        </div>
      </div>
    </div>
  );
};

export default Homepage;
