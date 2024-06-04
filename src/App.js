
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import User from "./UserUI/User";
import Profile from './UserUI/DogProfiles';
import Report from "./UserUI/Report"
import Admin from './AdminUI/AdminUI.js';
import Sitter from './SitterUI/SitterUI.js';
import Jobs from './JobInbox.js';
import SignIn from './SignIn'; 
import SignUp from './SignUp';
import AuthDetails from './AuthDetails';
import Book from './Booking.js';
import JobInbox from "./SitterUI/JobInbox.js";
import HomePage from "./HomePage.js";
import SignInSide from "./SignInSide.js";
import SignUp2 from "./SignUp2.js";

export default function App() {
    return(
        <BrowserRouter>
            <Nav/>
            <Routes >
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/UserUI" element={<User />}></Route>
                <Route path="/profiles" element={<Profile />}></Route>
                <Route path="/report" element={<Report />}></Route>
                <Route path="/AdminUI" element={<Admin />}></Route>
                <Route path="/SitterUI" element={<Sitter />}></Route>
                <Route path="/Jobs" element={<Jobs />}></Route>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/booking" element={<Book />} />
                <Route path="/inbox" element={<JobInbox />} />
                <Route path="/login" element={<SignInSide />} />
                <Route path="/signupp" element={<SignUp2 />} />
                <Route path="/signuppage" element={
                <>
                    <SignIn />    
                    <AuthDetails/>
                </>
                } /> 
            </Routes>
        </BrowserRouter>
    )
}


