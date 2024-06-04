import React, { useState } from "react";
import { auth,db } from "./firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Link, useNavigate  } from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore';



const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signIn = async (e) => {
    e.preventDefault();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", userCredential.user.uid);
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {

        const userData = docSnap.data();
        const userType = userData.UserType;
        const isVerified = userData.IsVerified;

      console.log(`UserType: ${userType}, IsVerified: ${isVerified}`); 
  
        if (userType === 'sitter' && isVerified !== true) {
          await signOut(auth); 
          alert("Wait for verification!");
        } else if (userType === 'user') {
          navigate('/UserUI');
        } else if (userType === 'sitter') {
          navigate('/SitterUI');
        }
      } else {
        console.error("No user document found.");
      }
    } catch (error) {
      console.error("SignIn error:", error);
    }
  };
  
  
  


  return (
    <div className='sign-in-container'>
      <form onSubmit={signIn}>
        <h1>Log In to your account</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <p>Don't have an account? <Link to="/signup">Sign up here</Link></p> {/* Add this line */}

       
      </form>
    </div>
    
  )
}

export default SignIn;