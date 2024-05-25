import { useContext, useState } from 'react'
import './App.css'
import Login from './components/login.jsx'
import Register from './components/register.jsx'
import ImageUpload from './components/ImageUpload.jsx'
import ImageAuth from './components/ImageAuth.jsx'
import UserHomepage from './components/UserHomepage.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  
  return (
    //  {/* <Router>
    //         <Routes>
    //             <Route path="/" element={<Login />}></Route>
    //             <Route path="/register" element={<Register />}></Route>
    //             <Route path="/image-upload" element={<ImageUpload />}></Route>
    //             <Route path="/image-auth/:imageUrl" element={<ImageAuth />}></Route>
    //         </Routes>
    //      </Router> */}
    //     {/*< ImageAuth /> */}


        // <Router>
        //     <Routes>
        //         <Route path="/" element={<ImageUpload />}></Route>
        //         <Route path="/image-auth" element={<ImageAuth />}></Route>
        //     </Routes>
        // </Router>
        <Router>
          <Routes>
            <Route exact path="/" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/image-upload" element={<ImageUpload />}></Route>
            <Route path="/image-auth" element={<ImageAuth />}></Route>
            <Route path="/user-home" element={<UserHomepage />}></Route>
            <Route path="/forgot-pass" element={<ForgotPassword />}></Route>
          </Routes>
        </Router>
  )
}

export default App
