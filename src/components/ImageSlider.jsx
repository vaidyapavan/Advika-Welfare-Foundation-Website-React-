import React from "react";
import SimpleImageSlider from "react-simple-image-slider";
import slide1 from  '../assets/images/slider_onen.png';
import slide2 from '../assets/images/slider_twon.png';
import slide3 from '../assets/images/slider_threen.png';

import  '../assets/Signup.module.css'; 

const images = [
    { url: slide1 },
    { url: slide2 },
    { url: slide3 }
];

function ImageSlider() {
    return (
        <div className="slider-container">  
            <SimpleImageSlider style={{marginLeft:"150px"}}
                className="slider"
                width={1200}
                height={450}
                images={images}
                showNavs={true}
                autoPlay={true}  
                autoPlayDelay={4.0}  
                onClick={(idx, event) => console.log(`Image ${idx + 1} clicked`)}
            />
        </div>
    );
}

export default ImageSlider;
