import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../assets/Homepage.css';
import profile from '../assets/images/profile2.jpg';
import advika from '../assets/images/Advika.png'; 
import ImageSlider from '../components/ImageSlider'; 
import FeatureSection from '../components/FeatureSelection';
import Info from '../components/Info';
import Bottom from '../components/Bottom';
import Galary from '../components/Galary';
import Footer from '../components/Footer';

function Homepage() {
  const navigate = useNavigate(); 

  const gotoLoginPage = () => {
    navigate('/login'); 
  };

  const gotoGalary = () => {
    navigate('/galary'); 
  };

  const gotoFeatureSelection = () => {
    navigate('/featureselection'); 
  };

  const gotoContact = () => {
    navigate('/footer'); 
  };

  return (
    <div className="app">
      <header className="app-header">
        <nav className="navbar">
          <div className="navbar-left">
            <img src={advika} alt="Advika" className="advika-image" /> 
            <a href="#home" onClick={() => window.scrollTo(0, 0)}>Home</a>
            <a onClick={gotoFeatureSelection} style={{ cursor: "pointer" }}>About Us</a>
            <a onClick={gotoContact} style={{ cursor: "pointer" }}>Contact Us</a>
            <a onClick={gotoGalary} style={{ cursor: "pointer" }}>Gallery</a>
          </div>
          <div className="navbar-right">
            <img
              src={profile}
              alt="Profile"
              className="profile-image"
              onClick={gotoLoginPage} 
            />
          </div>
        </nav>
      </header>

      <main>
        <ImageSlider />
        <FeatureSection />
        <Info />
        <Galary />
        <Bottom />
        <Footer />
      </main>
    </div>
  );
}

export default Homepage;
