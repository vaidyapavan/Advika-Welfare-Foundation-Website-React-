import React from "react";
import SimpleImageSlider from "react-simple-image-slider";
import slide1 from '../assets/images/slider_onen.png';
import slide2 from '../assets/images/slider_twon.png';
import slide3 from '../assets/images/slider_threen.png';
// FontAwesome icons
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const images = [
    { url: slide1 },
    { url: slide2 },
    { url: slide3 }
];

function ImageSlider() {
    return (
        <div className="slider-container">  
            <SimpleImageSlider 
                style={{marginLeft:"230px"}}
                className="slider"
                width={1200}
                height={450}
                images={images}
                showNavs={true}
                autoPlay={true}  
                autoPlayDelay={5.0}  
                onClick={(idx, event) => console.log(`Image ${idx + 1} clicked`)}
                // Custom navigation components
                customNavs={
                    (onPrev, onNext) => (
                        <div className="custom-navs">
                            <button className="prev-arrow"  style = {{ border: "10px", borderRadius:"20px"}} onClick={onPrev}>
                                <FaArrowLeft size={30} color="#000"  style={{backgroundColor:"blue"}} />
                            </button>
                            <button className="next-arrow" onClick={onNext}>
                                <FaArrowRight size={30} color="#000" />
                            </button>
                        </div>
                    )
                }
            />
        </div>
    );
}

export default ImageSlider;
