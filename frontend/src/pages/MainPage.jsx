import React from 'react';
import '../Mainpage.css';
import { Link, useNavigate, useHistory } from 'react-router-dom'
import Header from '../components/Header';
import { logout } from '../features/auth/authSlice';
import paxpalLogo from '../paxpalLogo.png'
const MainPage = ({ handleNavigation }) => {
  const handleLogout = () => {
    // Perform logout actions here
    // You might want to clear user authentication or session data
    // and redirect to the login page
    console.log('Logout clicked');
  };


  return (
    <div className="main-page-container">
      <img src={paxpalLogo} className='paxpallogo'></img>
      <div className="content">
        <div className="hero-section">
          <h1>Welcome to PaxPal</h1>
          <p>Track your glucose levels, meals, and manage your diabetes with PaxPal.</p>
        </div>
        <div className="features-section">
          <div className="feature">
            <h2>Log Entries</h2>
            <p>Record your daily glucose levels and monitor your trends over time.</p>
          </div>
          <div className="feature">
            <h2>Meal Planning</h2>
            <p>Create and manage personalized meal plans to maintain a balanced diet.</p>
          </div>
          <div className="feature">
            <h2>Medication Tracker</h2>
            <p>Keep track of your medication schedule and dosage.</p>
          </div>
          <div className="feature">
            <h2>Survey</h2>
            <p>Participate in surveys to contribute to diabetes research and community insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

/**
 *       <header className="header">
        <div className="logo">PaxPal</div>
        <div className="buttons-container">
          <Link to = "/dashboard">
            <button>Log Entry</button>
          </Link>
          <Link to = "/Import">
            <button>Import Data</button>
          </Link>
          <Link to = "/Graphs">
            <button >Visualize</button>
          </Link>
          <Link to = "/Survey">
            <button>Survey</button>
          </Link>

        </div>
        
      </header>
 */