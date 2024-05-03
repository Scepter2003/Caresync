import React from 'react';
import { useDoctorData } from '../components/Contexts/doctorcontext';
import Profiled from '../components/SmallCOmp/profiled';
import Navbard from '../components/SmallCOmp/Navbard';
const Doctorhome = () => {
  return (
    <div>
      <Navbard/>
      <Profiled/>
    </div>
  );
};

export default Doctorhome;