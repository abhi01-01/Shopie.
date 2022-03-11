import React from 'react';
import {ReactNavbar} from "overlay-navbar" ;
import Shopielogo from "../../../images/Shopielogo.png" ;

const Header = () => {
  return <ReactNavbar
    burgerColor="green"
    burgerColorHover="crimson"
    navColor1="#1a1a1a"
    logo={Shopielogo}
    
    logoWidth="22vmax"
    logoHeight="28vmax"
    logoHoverColor="red"
    logoHoverSize="25px"

    link1Text="Home"
    link2Text="Products"
    link3Text="Contact"
    link4Text="About"

    link1Url="/"
    link2Url="/products"
    link3Url="/contact"
    link4Url="/about"
    profileIconUrl="/login"

    link1Size="2.4vmax"
    link1Family="cursive"
    link1Color="white"
    

    nav1justifyContent="flex-end"
    nav2justifyContent="flex-end"
    nav3justifyContent="flex-start"
    nav4justifyContent="flex-start"

    link1ColorHover="crimson"
    link1Margin="2.2vmax"

    searchIconColor="white"
    cartIconColor="white"
    profileIconColor="white"

    searchIconSize="2.5vmax"
    cartIconSize="2.5vmax"
    profileIconSize="3vmax"

    searchIconColorHover="crimson"
    cartIconColorHover="crimson"
    profileIconColorHover="crimson"

    cartIconMargin="1.5vmax"
  />
}

export default Header
