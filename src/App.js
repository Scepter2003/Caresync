import React from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MedfileProvider } from './components/Contexts/useMedfile';
import Home from './Pages/Home';
import About from './Pages/About';
import Feedback from './Pages/Feedback';
import AdminPage from './Pages/admin';
import './App.css';
import Trends from './Pages/Trends';
import { AuthProvider } from "./components/Contexts/AuthContext"
import ProtectedRoute from "./components/Auth/PrivateRouter"
import Login from "./components/Auth/Login"
import DoctorPage from './Pages/doctor';
import ForgotPassword from "./components/Auth/ForgotPassword"
import Signup from "./components/Auth/Signup"
import DoctorSignup from './components/Auth/Dsignup';
import { UserDataProvider } from './components/Contexts/UserDataContext';
import PharmaSignup from './components/Auth/Psignup';
import Doctorhome from './Pages/dochome';
import { DoctorDataProvider } from './components/Contexts/doctorcontext';
import NewsPage from './components/SmallCOmp/news';
import Searchp from './components/SmallCOmp/searchp';
import Pharmahome from './Pages/pharhome';
import PharmaPage from './Pages/Pharmapage';
import Searchpp from './components/SmallCOmp/searchpp';
import Feedbackp from './components/SmallCOmp/feedbackp';
import Feedbackd from './components/SmallCOmp/feedbackd';
import NewsPaged from './components/SmallCOmp/newsd';
import AdminPag from './Pages/admin1';
import Addnews from './Pages/addnews';
import Khabar from './Pages/khabar';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <DoctorDataProvider>
        <UserDataProvider>
          <MedfileProvider>
        <Routes>
          <Route exact path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><Trends /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          <Route path="/feedbackd" element={<ProtectedRoute><Feedbackd /></ProtectedRoute>} />
          <Route path="/feedbackp" element={<ProtectedRoute><Feedbackp/></ProtectedRoute>} />
          <Route path="/p" element={<ProtectedRoute><Searchpp /></ProtectedRoute>} />
          <Route path="/pharma" element={<PharmaSignup /> }/>
          <Route path="/Docsignup" element={<DoctorSignup />}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/newss" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
          <Route path="/news" element={<ProtectedRoute><Khabar/></ProtectedRoute>} />
          <Route path="/newsd" element={<ProtectedRoute><NewsPaged /></ProtectedRoute>} />
          <Route path="/searchp" element={<ProtectedRoute><Searchp /></ProtectedRoute>} />
          <Route path="/admi" element = {<ProtectedRoute><AdminPage /></ProtectedRoute>}/>
          <Route path="/dochome" element = {<ProtectedRoute><Doctorhome /></ProtectedRoute>}/>
          <Route path="/pharhome" element= { <ProtectedRoute><Pharmahome /></ProtectedRoute>}/>
          <Route path="/doctpage" element = {<ProtectedRoute><DoctorPage /></ProtectedRoute>}/>
          <Route path="/pharpage" element= { <ProtectedRoute><PharmaPage /></ProtectedRoute>}/>
          <Route path="/addnewss" element={<ProtectedRoute><Addnews/></ProtectedRoute>}/>
          <Route path="/admi1" element={<ProtectedRoute><AdminPag/></ProtectedRoute>}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        </MedfileProvider>
        </UserDataProvider>
        </DoctorDataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;