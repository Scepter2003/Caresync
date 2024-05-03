import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

export const EmailForm = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    const templateParams = {
        message: form.current.message.value,
        recipient : form.current.recipient.value,
      };

    emailjs.sendForm('service_4mdueyv', 'template_ipny01f', form.current, '_PJ3-S34LJ3-pqxIp')
      .then((result) => {
        console.log(result.text);
        console.log("message sent!");
      }, (error) => {
        console.log(error.text);
        console.log(error);
        console.log("error sending message, try again!");
      });
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      <input name='recipient' type="email" placeholder='Email' required />
      <textarea name='message' placeholder='Write message...' required ></textarea>
      <button type="submit">Send Message</button>
    </form>
  );
};