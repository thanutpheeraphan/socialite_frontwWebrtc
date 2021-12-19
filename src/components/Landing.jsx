import React, { Fragment, useState, useEffect } from "react";
import './Landing.css'
import logo from "../img/mainicon.svg";
import pic1 from "../img/pic1.svg";
import { homeSecOne, homeSecTwo, homeSecThree } from "./HomeContent";
import HomeSection from "./Lander";

const Homepage = ({ setAuth }) => {
  return (
    <Fragment>
      	 <div className='bg'>
			<div className='blank'/>
			<h1 className='home'>Socialite</h1>
			<h1 className='home'>JOIN, LISTEN, and SPEAK</h1>
			<div className='content'>Enjoy the smooth communication during the meeting</div>
			<div className='content'>Join the channel to meet with new people and talk to them!</div>
			<div className='blank'/>
			<div className='blank'/>
		</div> 
		<HomeSection {...homeSecOne}/>
		<HomeSection {...homeSecTwo}/>
		<HomeSection {...homeSecThree}/>
		
    </Fragment>
  );
};

export default Homepage;

  