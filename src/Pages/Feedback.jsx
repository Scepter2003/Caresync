import React from 'react';
import Navbar from './Navbar';
import { EmailForm } from '../components/Auth/emailform';
const Feedback = () => {
  const handleSubmit = (event)=> {
    event.preventDefault();

  }
  return (
    <>
    <Navbar />
    <div>
      <h1>Feedback</h1>
      <p>This is the content for the feedback page.</p>
      <form>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />
        <br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <br />
        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message" required></textarea>
        <br />
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
   <div>
    <EmailForm />
   </div>
    </>
  );
};

export default Feedback;