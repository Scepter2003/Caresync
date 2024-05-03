
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { auth } from "../firebase/firebase";
import React, { useRef, useState, useContext } from "react"
const NavBar = styled.nav`
 //background-color: #333;
 background: #5aadce;
 height: 60px;
 display: flex;
 justify-content: space-around;
 align-items: center;
`;

const NavLink = styled(Link)`
 color: black;
 font-size: 15px;
 margin: 0 8px;
 padding: 0 10px;
 height: 100%;
 display: flex;
 align-items: center;
 text-decoration: none;

 &:hover {
    background-color: #ddd;
    color: black;
 }
`;
function logout(){
   return auth.signOut()
}
const Navbard = () => {
 return (
    <NavBar>
      <NavLink to="/dochome">Dashboard</NavLink>
      <NavLink to="/searchp">Patient</NavLink>
      <NavLink to="/newsd">News</NavLink>
      <NavLink to="/feedbackd">Explore</NavLink>
      <button onClick={logout}>Logout</button>
    </NavBar>
 );
};

export default Navbard;