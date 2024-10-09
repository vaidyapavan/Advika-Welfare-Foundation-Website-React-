import React from 'react';
import  '../assets/Galary.css';

// Import images
import item1 from '../assets/images/item1.png';
import item2 from '../assets/images/item2.png';
import item3 from '../assets/images/item3.png';
import item4 from '../assets/images/item4.png';
import item5 from '../assets/images/item5.png';
import item6 from '../assets/images/item6.png';
import item7 from '../assets/images/item7.png';
import item8 from '../assets/images/item8.png';


const Gallary = () => {
  const works = [
    {
      imgSrc: item1,
      title: 'LSOM Bavdhan',
      description: 'AWF shown up as charity partner for LSOM Bavdhan - one of the well known running event in Pune.',
      fullImgSrc: item1,
    },
    {
      imgSrc: item2,
      title: 'Sakal Sanman 2019',
      description: 'AWF received Sakal newpaper\'s prestigious Nanasaheb Parulekar Krutadnyata Sanman 2019.',
      fullImgSrc: item2,
    },
    {
      imgSrc: item3,
      title: 'Media Coverage',
      description: 'AWF work was covered by Sakal newspaper in August 2019.',
      fullImgSrc: item3,
    },
    {
      imgSrc: item4,
      title: 'Trip to Madheghat',
      description: 'A quick trip to famous mansoon gate away near pune - Madheghat waterfalls',
      fullImgSrc: item4,
    },
    {
      imgSrc: item5,
      title: 'Happy Faces',
      description: 'Those smiles on their faces gives us the boost to work harder.',
      fullImgSrc: item5,
    },
    {
      imgSrc: item6,
      title: 'IT Quiz Award - Someshwar',
      description: 'Not just syllabus, our boys are proving themselves in extracurricular activities as well.',
      fullImgSrc: item6,
    },
    {
      imgSrc: item7,
      title: 'Saraswati Pujan on Dasra',
      description: 'Celebrating Dasra with Saraswati pujan. May godess saraswati bless all our boys with wisdom.',
      fullImgSrc: item7,
    },
    {
      imgSrc: item8,
      title: 'Journey So Far',
      description: 'Quick look at our journey so far. Still a long way to go!',
      fullImgSrc: item8,
    },
  ];

  return (
    <section id="recent-works">
      <div className="container">
        <div className="center wow fadeInDown">
          <h2>Gallery</h2>
          <p className="lead">Quick tour of AWF through the picture to give you a flavour of our happiness that we are trying to share.</p>
        </div>

        <div className="row">
          {works.map((work, index) => (
            <div className="col-xs-12 col-sm-4 col-md-3" key={index}>
              <div className="recent-work-wrap">
                <img className="img-responsive" src={work.imgSrc} alt={work.title} />
                <div className="overlay">
                  <div className="recent-work-inner">
                    <h3><a href="#">{work.title}</a></h3>
                    <p>{work.description}</p>
                    <a className="preview" href={work.fullImgSrc} rel="prettyPhoto"><i className="fa fa-eye"></i> View</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/*/.row*/}
      </div>
      {/*/.container*/}
    </section>
  );
};

export default Gallary;
