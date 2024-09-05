


import React from "react";

import '../assets/Footer.css';

const Footer = () => { 
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>About Us</h3>
          <p>Advika Welfare Foundation was established in 2017 with the aim of providing higher education to destitute children
coming from rural areas. As of June 2019, we are supporting 12 such students - 10 residential and 2 non-residential.</p>
        </div>
        <div className="footer-column">
          <h3>Contact</h3>
          <p>Email: shripadghodke@gmail.com</p>
          <p>Phone: +91 9552560631</p>
        </div>
        <div className="footer-column">
          <h3>Follow us</h3>
          <div className="social-links">
            <a href="https://www.linkedin.com/company/advikawelfarefoundation/"><i className="fab fa-facebook-f">Linkedin</i></a>
            <a href="https://www.facebook.com/advikawelfarefoundation/"><i className="fab fa-twitter"> Facebook</i></a>
            <a href="https://www.instagram.com/advika_welfare_foundation/"><i className="fab fa-instagram">Instagram</i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2024 Your Website. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

























