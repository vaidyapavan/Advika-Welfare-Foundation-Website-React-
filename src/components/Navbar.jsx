import React from "react";
import logo from '../assets/images/advikalogo.png';
const Navbar = () =>
{
    return(
        <>
        <div className="navbarContainer">
            <div className="Navbar">
            <a href="#home" onClick={() => window.scrollTo(0, 0)}>Home</a>
            <a onClick={gotoFeatureSelection} style={{ cursor: "pointer" }}>About Us</a>
            <a onClick={gotoContact} style={{ cursor: "pointer" }}>Contact Us</a>
            <a onClick={gotoGalary} style={{ cursor: "pointer" }}>Gallery</a> 

            </div>

        </div>
        </>
    )
}

 export  default Navbar;