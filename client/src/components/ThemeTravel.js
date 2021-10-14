import React, { useState, useEffect } from 'react';
import ThemeSlide from './ThemeSlide';
import { API_URL } from '../config/constants';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ThemeTravel.css';

function ThemeTravel(props) {
  return (
    <>
      <div id="landing-top-content">
        <video width="300" height="200" muted autoplay="autoplay" loop>
          <source src="https://pixabay.com/ko/videos/download/video-48873_medium.mp4" type="video/mp4" muted />
        </video>
        <span id="landing-top-text">{`테마별 여행`}</span>
        <ThemeSlide />
      </div>
    </>
  );
}
export default ThemeTravel;
