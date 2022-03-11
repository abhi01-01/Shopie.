import React from 'react'
import playstore from "../../../images/google.png" ;
import appstore from "../../../images/apple.png" ;
import "./Footer.css"

const Footer = () => {
  return (
      <footer>
          <div className='leftFooter'>
              <h4>DOWNLOAD MY APP</h4>
              <p>Download app for Andriod and IOS mobile phones</p>
              <img src={playstore} alt="playstore" />
              <img src={appstore} alt="appstore" />
          </div>
          <div className='midFooter'>
              <h1>Shopie.</h1>
              <p>High quality is our first priority.</p>
              <p>Copyrights 2022 &copy; Abhishek Singh</p>
          </div>
          <div className='rightFooter'>
              <h4>Follow me</h4>
              <a href="https://www.linkedin.com/in/abhishek0105/">Linked In</a>
              <a href="https://www.instagram.com/_singh.tanishq_/">Instagram</a>
              <a href="https://github.com/abhi01-01">Git Hub</a>
          </div>
      </footer>
    
  );
}

export default Footer
