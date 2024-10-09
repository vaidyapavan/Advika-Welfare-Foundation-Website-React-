import React from 'react';
import '../assets/Bottom.css';

const Bottom= () => {
  return (
    <>
      <section id="bottom">
        <div className="container wow fadeInDown" data-wow-duration="1000ms" data-wow-delay="600ms">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="widget">
                <h3>Map Location</h3>
                <ul style={{ paddingTop: '10px' }}>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.661579870292!2d73.79907851537938!3d18.498982274661117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDI5JzU2LjMiTiA3M8KwNDgnMDQuNiJF!5e0!3m2!1sen!2sin!4v1630134657388!5m2!1sen!2sin" 
                    width="100%" 
                    height="270" 
                    frameBorder="0" 
                    style={{ border: '0' }} 
                    allowFullScreen 
                    title="Map Location"
                  />
                </ul>
              </div>
            </div>

            <div className="col-md-6 col-sm-12">
              <div className="widget">
                <h3>Contact Us</h3>
                <ul>
                  <li><b>Reg. Address:</b><br />4A Pradnyadeep Apt, Pradnya Park, Mahatma Soc, Kothrud, Pune 411038</li>
                  <li><b>Hostel Address:</b><br />Ground Floor, Kusuma Bunglow, Plot No 3, Sahajanand Soc, Kothrud, Pune 411038</li>
                  <li><b>Email:</b><br />shripadghodke@gmail.com</li>
                  <li><b>Phone:</b><br />+91 9552560631</li>
                  <li><b>FB Page:</b><br />@AdvikaWelfareFoundation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Bottom;
