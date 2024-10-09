import React, { useState } from 'react';
import '../assets/Info.css';

const Info = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section id="middle">
      <div className="container">
        <div className="row">
          <div className="col-sm-6 wow fadeInDown">
            <div className="skill">
              <h2>Whom Do We Support?</h2>
              <p>
                Bright students from needy families or NGOs, typically from rural areas, face tremendous challenges to pursue their higher education after passing 10th grade...
              </p>
              <p>
                At Advika Welfare Foundation, we try to address the needs of this particular segment by helping them with stay, food, education, and any other required support in Pune...
              </p>
              <h2>Selection Criteria</h2>
              <ul>
                <li>Real needy, honest, and children with good learning attitude</li>
                <li>Strong willingness to pursue higher studies</li>
                <li>At least 60% score in 10th exam</li>
              </ul>
            </div>
          </div>

          <div className="col-sm-6 wow fadeInDown">
            <div className="accordion">
              <h2>How Can You Help Us?</h2>
              <div className="panel-group" id="accordion1">
                <div className="panel panel-default">
                  <div className="panel-heading active">
                    <h3 className="panel-title">
                      <a
                        className="accordion-toggle"
                        onClick={() => handleToggle(1)}
                      >
                        Monetary Donations
                        <i className={`fa fa-angle-${activeIndex === 1 ? 'down' : 'right'} pull-right`}></i>
                      </a>
                    </h3>
                  </div>

                  {activeIndex === 1 && (
                    <div className="panel-body">
                      <div className="media accordion-inner">
                        <div className="media-body">
                          <span style={{ color: 'red' }}>
                            All monetary donations to Advika Welfare Foundation are eligible for tax exemption under 80G section.
                          </span>
                          <br />
                          <br />
                          <ul style={{ paddingLeft: '0px' }}>
                            <li>
                              <p>Consistent monthly donation of Rs. 500 / 1000 / 1500 / 2000 or more</p>
                            </li>
                            <li>
                              <p>Donations on the occasion of your/your family member’s birthday, anniversary, etc.</p>
                            </li>
                            <li>
                              <p>Sponsor college fees</p>
                            </li>
                            <li>
                              <p>Sponsor one month's food expenses for one child (approx Rs. 3500/-)</p>
                            </li>
                            <li>
                              <p>Sponsor tuition fees for one subject (approx Rs. 15000/-)</p>
                            </li>
                            <li>
                              <p>Sponsor/contribute in administrative expenses of AWF</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h3 className="panel-title">
                      <a
                        className="accordion-toggle"
                        onClick={() => handleToggle(2)}
                      >
                        In-Kind Donations
                        <i className={`fa fa-angle-${activeIndex === 2 ? 'down' : 'right'} pull-right`}></i>
                      </a>
                    </h3>
                  </div>
                  {activeIndex === 2 && (
                    <div className="panel-body">
                      <ul style={{ paddingLeft: '0px' }}>
                        <li>
                          <p>Donate stationery, books, pens, etc.</p>
                        </li>
                        <li>
                          <p>Donate new/unused clothes, bedding material, etc.</p>
                        </li>
                        <li>
                          <p>Donate a bicycle</p>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h3 className="panel-title">
                      <a
                        className="accordion-toggle"
                        onClick={() => handleToggle(3)}
                      >
                        Building Connections
                        <i className={`fa fa-angle-${activeIndex === 3 ? 'down' : 'right'} pull-right`}></i>
                      </a>
                    </h3>
                  </div>
                  {activeIndex === 3 && (
                    <div className="panel-body">
                      <ul style={{ paddingLeft: '0px' }}>
                        <li>
                          <p>Social media networking</p>
                        </li>
                        <li>
                          <p>Personal networking</p>
                        </li>
                        <li>
                          <p>Connect to the CSR teams of your organization</p>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h3 className="panel-title">
                      <a
                        className="accordion-toggle"
                        onClick={() => handleToggle(4)}
                      >
                        Share Your Skills
                        <i className={`fa fa-angle-${activeIndex === 4 ? 'down' : 'right'} pull-right`}></i>
                      </a>
                    </h3>
                  </div>
                  {activeIndex === 4 && (
                    <div className="panel-body">
                      <ul style={{ paddingLeft: '0px'  }}>
                        <li>
                          <p>Teaching sessions with kids in your expertise area</p>
                        </li>
                        <li>
                          <p>Extend your help in admin/backend activities of AWF</p>
                        </li>
                        <li>
                          <p>Casual interactive sessions with the boys for their personality betterment</p>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Info;
