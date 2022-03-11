import React , {Fragment} from "react";
import "./Contact.css";
import CodeIcon from '@mui/icons-material/Code';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import { Button } from '@mui/material';
import MetaData from "../MetaData"

const Contact = () => {
  return (
    <Fragment>
    <MetaData title={"Shopie. || Contact"}/>
    <div className="contactContainer">
      <div className="topContainer">
          <h1 >Contact me</h1>
          <h3>get in touch</h3>
      </div>
      <div className="bottomContainer">
        <div className="rightBox">
           <h2>Get in touch</h2> 
            <div className="row">
                <CodeIcon/>
                <div className="info">
                    <div className="head">Designed & Developed by:</div>
                    <div className="sub-title">Abhishek Singh</div>
                </div>
            </div>
            <div className="row">
                <LocationOnIcon/>
                <div className="info">
                    <div className="head">Address:</div>
                    <div className="sub-title">Siddharth Nagar, U.P. , India </div>
                </div>
            </div>
            <div className="row">
                <EmailIcon/>
                <div className="info">
                    <div className="head">Email:</div>
                    <div className="sub-title">abhisingh100392@gmail.com</div>
                </div>
            </div>                                                
        </div>
        <div className="leftBox">
          <h2>Message me</h2>
          <form method="POST" action="https://formspree.io/f/xknyojdv">
          <div className='NameBox'>
             <input 
             type="text"
             placeholder='Name'
             required 
             name='name'
             />
          </div>
          <div className='EmailBox'>
             <input 
             type="email"
             placeholder='Email'
             required 
             name='email'
             />
          </div>
          <div className='SubjectBox'>
             <input 
             type="text"
             placeholder='Subject'
             required 
             name='subject'
             />
          </div>
          <div className='MessageBox'>
             <input 
             type="text"
             placeholder='Message...'
             required 
             name='message'
             />
          </div>
          <Button
              id="MessageBtn"
              type="submit"
            >
              Send Message
            </Button>
            </form>  
        </div>
      </div>
    </div>  
    </Fragment>
      
  );
};

export default Contact;