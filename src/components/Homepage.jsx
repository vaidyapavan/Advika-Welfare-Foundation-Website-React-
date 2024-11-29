import React, { useRef } from 'react';
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

  // Refs to scroll to different sections
  const featureSectionRef = useRef(null);
  const galaryRef = useRef(null);
  const footerRef = useRef(null);

  const gotoLoginPage = () => {
    navigate('/login'); 
  };

  const gotoGalary = () => {
    galaryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const gotoFeatureSection = () => {
    featureSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const gotoContact = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const gotoHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <header className="app-header">
        <nav className="navbar">
          <div className="navbar-left">
            <img src={advika} alt="Advika" className="advika-image" /> 
            <a onClick={gotoHome} style={{ cursor: "pointer" }}>Home</a>
            <a onClick={gotoFeatureSection} style={{ cursor: "pointer" }}>About Us</a>
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
        
       
        <div ref={featureSectionRef}>
          <FeatureSection />
        </div>

        <Info />

        <div ref={galaryRef}>
          <Galary />
        </div>

        <Bottom />
       

 
        <div ref={footerRef}>
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default Homepage;
