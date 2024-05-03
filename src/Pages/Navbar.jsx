
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { auth } from "../components/firebase/firebase";
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
const Navbar = () => {
 return (
    <NavBar>
      <NavLink to="/about">Dashboard</NavLink>
      <NavLink to="/feed">Trends</NavLink>
      <NavLink to="/news">News</NavLink>
      <NavLink to="/feedback">Feedback</NavLink>
      <button onClick={logout}>Logout</button>
    </NavBar>
 );
};

export default Navbar;