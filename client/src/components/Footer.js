import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  const teamName = [
    { name: '남궁민', src: 'https://github.com/nmin11' },
    { name: '이준희', src: 'https://github.com/skalook' },
    { name: '황재성', src: `https://github.com/shreder0804` },
  ];

  const githubLink = teamName.map((ele) => {
    return (
      <div className="github">
        <a className="github-link" href={ele.src} target="_blank">
          <img src="/images/github_icon.png" alt="github icon" />
          <span>{ele.name}</span>
        </a>
      </div>
    );
  });

  return (
    <>
      <div id="body-wrapper">
        <div id="body-content">
          <footer id="footer">
            <img src="/images/projecttt_logo_gray.png" alt="Project_TT Logo Gray"></img>
            <div id="footer-wrapper">{githubLink}</div>
            <span>ⓒ2021. Hanguseok. All rights reserved.</span>
          </footer>
        </div>
      </div>
    </>
  );
}

export default Footer;
