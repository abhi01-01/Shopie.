import React from 'react'
import "./about.css"
import { Typography , Button , Avatar } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MetaData from '../MetaData';

const About = () => {
    const visitInstagram = () => {
    window.location = "https://www.instagram.com/_singh.tanishq_/";
  };
  return (
    <div className="aboutSection">
    <MetaData title={"Shopie. || About"}/>
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/shopie/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1646851649/IMG_20211120_102551_gnlmin.jpg"
              alt="Founder"
            />
            <Typography>Abhishek Singh</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a simple E-commerce wesbite named Shopie. made by abhi01-01 Only with the
              purpose to learn MERN Stack and implement it.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Meet me</Typography>
            <a
              href="https://www.linkedin.com/in/abhishek0105/"
              target="blank"
            >
              <LinkedInIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://wa.me/919792187683" target="blank">
              <WhatsAppIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
