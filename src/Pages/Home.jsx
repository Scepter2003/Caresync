import React from 'react';
import Navbar from './Navbar';
const Home = () => {
  return (
    <>
    <Navbar />
    <div style={{marginLeft:"0"}}>
      <h1>Welcome to the <font style={{color:"#964dc7",fontFamily: 'Georgia, serif'}}>CareSync !!!</font></h1>
      <p style={{fontFamily: 'Georgia, serif'}}>Your trusted platform for 
        managing your health records and connecting 
        with healthcare professionals.</p>
        <h1>Revolutionize Your Healthcare</h1>
      <p>Improve the way you take charge of your health with a single click. 
        Our website is set to bring about a revolutionary transformation in the current healthcare 
        landscape by seamlessly connecting you with cutting-edge technologies.
         We bridge the gap between you and the healthcare system, offering a seamless and 
         efficient experience.</p>
      <h2>Why Choose Us?</h2>
      <ul>
        <li>Highly secure data handling</li>
        <li>Lightning-fast accessibility</li>
        <li>Cutting-edge technologies</li>
        <li>Seamless healthcare experience</li>
      </ul>
    <p style={{backgroundColor:"#292324",width:"100%", textAlign:"center", margin:"0", padding:"0", color:"white"}}>
        Phone No.: +91-9082529992<br/>
        Gmail: jaiswarsatish70@gmail.com<br/>
        Address: Mumbai, Maharashtra, India<p>
        A website to boost the Healthcare system</p>
    <p>© 2024 CareSync, Inc.</p>
    </p>
    </div>
    </>
  );
};

export default Home;