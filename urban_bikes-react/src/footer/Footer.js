import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import {SocialIcon} from 'react-social-icons';
import "./Footer.css";

const FooterPage = () => {
  return (
    <MDBFooter color="blue" className="font-small pt-4 mt-4" 
    // style={{ position: "fixed", 
    // bottom: "0", 
    // left: "0", 
    // width: "100%",
    // zIndex: "1" }}
    >
      <MDBContainer fluid className="text-center text-md-left">
        <MDBRow>
          <MDBCol md="6" style={{ textAlign :'left',left: '40px' }}>
            <h5 className="title">Urban Bikes</h5>
            <p> 
              For locals who want to avoid the traffic and be more environmentally friendly. 
            </p>
            <p>
              For travelers who want to explore a new city by bike. 
            </p>
          </MDBCol>
          <MDBCol md="6" style={{ textAlign :'right', right: '40px'}}>
            <h5 className="title">Follow Us</h5>
            <div>
                <SocialIcon url="https://www.facebook.com/andreeacristina.grosu" className="social-icon"/> 
                <SocialIcon url="https://www.instagram.com/chasingsunshineroundtheworld" className="social-icon"/>
                <SocialIcon url="https://ro.pinterest.com/andreeagrosu87/_saved/" className="social-icon"/>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className="footer-copyright text-center py-3">
        <MDBContainer fluid>
          &copy; {new Date().getFullYear()} Copyright: Urban Bikes
        </MDBContainer>
      </div>
    </MDBFooter>
  );
}

export default FooterPage;